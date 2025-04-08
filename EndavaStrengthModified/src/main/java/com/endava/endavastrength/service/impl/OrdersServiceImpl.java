package com.endava.endavastrength.service.impl;

import java.util.ArrayList;
import java.util.List;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.endava.endavastrength.dtos.OrderItemDto;
import com.endava.endavastrength.dtos.OrdersDto;
import com.endava.endavastrength.dtos.OrdersResponseDto;
import com.endava.endavastrength.entities.OrderItems;
import com.endava.endavastrength.entities.Orders;
import com.endava.endavastrength.entities.PaymentSession;
import com.endava.endavastrength.entities.Product;
import com.endava.endavastrength.entities.Users;
import com.endava.endavastrength.enums.ErrorMessage;
import com.endava.endavastrength.enums.OrderStatus;
import com.endava.endavastrength.exceptions.AddressNotLinkedToUserException;
import com.endava.endavastrength.exceptions.ProductOutOfStockException;
import com.endava.endavastrength.exceptions.RecordNotFoundException;
import com.endava.endavastrength.mapper.OrdersMapper;
import com.endava.endavastrength.repositories.OrdersRepository;
import com.endava.endavastrength.response.PagedResponse;
import com.endava.endavastrength.service.OrderService;
import com.endava.endavastrength.service.PaymentSessionService;
import com.endava.endavastrength.service.ProductService;
import com.endava.endavastrength.service.UserAddressService;
import com.endava.endavastrength.service.UsersService;
import com.endava.endavastrength.util.PaginationUtil;

import lombok.RequiredArgsConstructor;

/**
 * Service implementation for managing Orders.
 */
@Service
@RequiredArgsConstructor
public class OrdersServiceImpl implements OrderService{
	
	private final OrdersRepository ordersRepository;
	
	private final UsersService usersService;
	
	private final ProductService productService;
	
	private final PaymentSessionService paymentSessionService;
		
	private final UserAddressService userAddressService;
	
	private final OrdersMapper ordersMapper;
	
	
    /**
     * Creates a new order.
     * 
     * @param ordersDto The DTO containing order details.
     * @return The created order response DTO.
     * @throws Insufficent stock Exception.
     */
	@Transactional
	@Override
	public OrdersResponseDto createOrder(OrdersDto ordersDto) {
		// This is the totalAmount before applying discounts / ES Cash.
		long totalAmount=0;
		
		Orders order=Orders.builder()
						   .user(usersService.fetchUserDetails(ordersDto.userId()))
						   .orderStatus(OrderStatus.PENDING)
						   .userAddress(userAddressService.findUserAddressById(ordersDto.userAddressId()))
						   .build();
		
		if(order.getUserAddress().getUser().getUserId()!=ordersDto.userId()) {
			throw new AddressNotLinkedToUserException(ErrorMessage.ADDRESS_AND_USER_NOT_LINKED.getMessage());
		}
		
		List<OrderItems> listOfOrderItems=new ArrayList<>();
		
		for(OrderItemDto orderItemDto:ordersDto.listOfOrderItemDtos()) {
			Product product =productService.findProductById(orderItemDto.productId());
			
			// Using an atomic query to reserve the stock ( Note : No two users can run this query at a time)
			// We are reserving the stock the moment order creates, this ensures consistency.
			int updatedRows=productService.reserveStock(product.getProductId(), orderItemDto.quantity());
			
			// If there are no updated rows , This ensures the product stock is not available
			if(updatedRows==0) {
				
				//Throwing a custom exception of prompting which product is out of stock.
				throw new ProductOutOfStockException(ErrorMessage.INSUFFICIENT_STOCK_FOR_PRODUCT.getMessage() + product.getProductName());
			}
			
			// Once everything is available, setting the orderItems for the order
			OrderItems orderItem=new OrderItems();
			orderItem.setOrder(order);
			orderItem.setProduct(product);
			orderItem.setQuantity(orderItemDto.quantity());
			
			// This is the totalPrice of that particular item.
			orderItem.setTotalPrice(orderItemDto.quantity()*(product.getDiscountedPrice()));
			
			// Adding each item's total price to the totalAmount.
			// This will be the totalAmount before applying discounts / ES Cash.
			totalAmount+=orderItem.getTotalPrice();
			
			// Adding the orderItem to the Order.
			listOfOrderItems.add(orderItem);
		}
		
		// Assigning the orderItems to the Order.
		order.setListOfOrderItems(listOfOrderItems);
		
		// Setting the intial totalAmount
		// This will be the totalAmount before applying discounts / ES Cash.
		order.setTotalPrice(totalAmount);
		
		// This is the Final OrderValue After User applying the ES cash / discount from the frontend.
		order.setTotalOrderValue(ordersDto.orderTotal());
		
		// Setting the Es Cash used for this Order.
		order.setEsCashUsed(ordersDto.esCashUsed());
		
		// Saving the order once all things done.
		Orders savedOrder=ordersRepository.save(order);
		 	
		// Creating a Payment Session Once Order is created.
		PaymentSession paymentSession= paymentSessionService.createPaymentSession(savedOrder);
		
		// Setting that payment Session for the order.
		savedOrder.setPaymentSession(paymentSession);
		
		// Persisting the order to make savedChanges
		// Returning a Dto Back.
		return ordersMapper.toCreateOrdersResponseDto(ordersRepository.save(savedOrder));
	}

	
    /**
     * Finds an order by its ID.
     * 
     * @param orderId The ID of the order.
     * @return The order entity.
     */
	@Override
	public Orders findById(long orderId) {
        return ordersRepository.findById(orderId)
                .orElseThrow(() -> new RecordNotFoundException("Order not found"));
	}
	
	
    /**
     * Cancels an order if it is in PENDING status.
     * 
     * @param orderId The ID of the order to cancel.
     */
	@Override
	@Transactional
    public void cancelOrder(long orderId) {
		
        Orders order = ordersRepository.findById(orderId)
                .orElseThrow(() -> new RecordNotFoundException(ErrorMessage.ORDER_NOT_FOUND.getMessage()));
        
        //	The Changes will be applied only when the order is in pending state.
        if (order.getOrderStatus().equals(OrderStatus.PENDING)) {
        	
        	// Iterating over all the OrderItems in the Order and Restoring the Stock Back.
            for (OrderItems item : order.getListOfOrderItems()) {
            	
            	// Using Atomic query to restore the stock back.
                productService.restoreStock(item.getProduct().getProductId(), item.getQuantity());
            }
            
            // Changing the Order Status to 'CANCELED'.
            order.setOrderStatus(OrderStatus.CANCELED);
            
            //Saving the Order.
            ordersRepository.save(order);
        }
    }
	
    /**
     * Updates an order.
     * 
     * @param order The order to update.
     * @return The updated order entity.
     */
	@Override
	public Orders updateOrders(Orders order) {
		return ordersRepository.save(order);
	}

	
    /**
     * Cancels orders by payment session IDs if they are in PENDING status.
     * 
     * @param sessionIds List of session IDs.
     */
	@Override
	public void cancelOrdersBySessionIds(List<Integer> sessionIds) {
		
		// Getting All the Orders which are pending state.
	    List<Orders> orders = ordersRepository.findOrdersBySessionIds(sessionIds);
	    
	    // Iterating over each order and canceling them.
	    for (Orders order : orders) {
	        if (OrderStatus.PENDING.equals(order.getOrderStatus())) {
	        	
	        	for (OrderItems item : order.getListOfOrderItems()) {
	        		
	        		// Restoring the Stock back.
	                productService.restoreStock(item.getProduct().getProductId(), item.getQuantity());
	            }
	        	
	        	// Changing Status to Canceled.
	            order.setOrderStatus(OrderStatus.CANCELED); 
	        }
	    }
	    
	    // Saving All Orders at a time.
	    ordersRepository.saveAll(orders);
	}


    /**
     * Retrieves all orders for a specific user.
     * 
     * @param userId The user ID.
     * @param pageable Pagination details.
     * @return A paged response of orders.
     */
	@Override
	public PagedResponse<OrdersResponseDto> getAllOrdersByUserId(long userId,Pageable pageable) {
		// This is used to check whether the user is present or not.
		Users user=usersService.fetchUserDetails(userId);
		
		// Getting all the orders with pagination.
		Page<Orders> pageOfUserOrders=ordersRepository.findByUser_UserId(user.getUserId(),pageable);
		
		return PaginationUtil.toPagedResponse(pageOfUserOrders.map(ordersMapper::toOrdersResponseDto));
	}

	
    /**
     * Retrieves all non-canceled orders.
     * 
     * @param pageable Pagination details.
     * @return A paged response of successful orders.
     */
	@Override
	public PagedResponse<OrdersResponseDto> getAllOrders(Pageable pageable) {
		Page<Orders> pageOfSuccessfullOrders=ordersRepository.findByOrderStatusNot(OrderStatus.CANCELED,pageable);
		return PaginationUtil.toPagedResponse(pageOfSuccessfullOrders.map(ordersMapper::toOrdersResponseDto));

	}


	@Override
	public long getTotalSpentByUser(long userId) {
		
		// This ensures user exists
		Users user=usersService.fetchUserDetails(userId);
		
		return ordersRepository.getTotalSpentByUser(user.getUserId());
	}

}
