package com.endava.endavastrength.service.impl;

import java.time.LocalDateTime;
import java.util.Map;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.endava.endavastrength.dtos.PaymentDto;
import com.endava.endavastrength.entities.Orders;
import com.endava.endavastrength.entities.Payment;
import com.endava.endavastrength.entities.Users;
import com.endava.endavastrength.enums.ErrorMessage;
import com.endava.endavastrength.enums.OrderStatus;
import com.endava.endavastrength.enums.PaymentSessionStatus;
import com.endava.endavastrength.enums.PaymentStatus;
import com.endava.endavastrength.exceptions.EmailSendingException;
import com.endava.endavastrength.exceptions.InvalidOrderStateException;
import com.endava.endavastrength.mapper.PaymentMapper;
import com.endava.endavastrength.repositories.PaymentRepository;
import com.endava.endavastrength.service.CartService;
import com.endava.endavastrength.service.OrderEmailService;
import com.endava.endavastrength.service.OrderService;
import com.endava.endavastrength.service.PaymentService;
import com.endava.endavastrength.service.PremiumService;
import com.endava.endavastrength.service.RealTimeNotificationService;
import com.endava.endavastrength.service.UsersService;

import jakarta.mail.MessagingException;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

/**
 * Service implementation for processing payments.
 */
@Slf4j
@Service
@RequiredArgsConstructor
public class PaymentServiceImpl implements PaymentService{
	
	private final PaymentRepository paymentRepository;
	
	private final OrderService orderService;
	
	private final CartService cartService;
	
	private final OrderEmailService orderEmailService;
	
	private final UsersService usersService;
	
	private final PremiumService premiumService;
	
	private final RealTimeNotificationService realTimeNotificationService;
	
	private final PaymentMapper paymentMapper;
	
    /**
     * Processes a payment for an order.
     * 
     * @param paymentDto The payment details.
     * @param isSuccess Whether the payment was successful or not.
     * @return The processed payment entity.
     */
	@Override
	@Transactional
	public PaymentDto processPayment(PaymentDto paymentDto,boolean isSuccess) {
		
		Orders order=orderService.findById(paymentDto.orderId());
		Users user=order.getUser();
		
		// Throwing Exception when Order is not in valid state.
		if(!order.getOrderStatus().equals(OrderStatus.PENDING)) {
			throw new InvalidOrderStateException(ErrorMessage.ORDER_STATE_NOT_VALID.getMessage());
		}
		
		// Throwing Exception when Payment Session is expired.
		if (order.getPaymentSession().getExpiresAt().isBefore(LocalDateTime.now())) {
			throw new InvalidOrderStateException(ErrorMessage.PAYMENT_SESSION_EXPIRED.getMessage());
        }
		
		// Creating Payment
		Payment payment=new Payment();
		payment.setOrder(order);
		payment.setPaymentMethod(paymentDto.paymentMethod());
		payment.setPaymentAmount(paymentDto.paymentAmount());
		payment.setPaymentDate(LocalDateTime.now());
		
		// If Success
		if(isSuccess) {
			
			// Setting the payment Status to 'SUCCESS'.
			payment.setPaymentStatus(PaymentStatus.SUCCESS);
			
			// Setting the order Status to 'PLACED'
            order.setOrderStatus(OrderStatus.PLACED);
            
            // Setting Payment Session to 'SUCCESS'
            order.getPaymentSession().setPaymentSessionStatus(PaymentSessionStatus.SUCCESS);
            
            // Clearing the Cart once order is successful.
            cartService.clearCart(order.getUser().getUserId());
            
            // Setting the ES Cash points to the user.
            user.setEsCashPoints(user.getEsCashPoints()+((long)(0.05*order.getTotalPrice())));
    		
            // Removing the ES Cash used for this Order from the User.
            if(user.getEsCashPoints()-order.getEsCashUsed()>=0) {
            	// This happens only when es cash coudn't be negative (safe side)
    			user.setEsCashPoints(user.getEsCashPoints()-order.getEsCashUsed());
    		}
            
            // Setting the Es Cash Points used for this order.
            order.setEsCashGained((long)(0.05*order.getTotalPrice()));
            
            // Checking if Premium Membership was purchased
            premiumService.activatePremiumIfPurchased(user, order);
            
            // Checking if user qualifies for free premium (₹20,000+ spent)
            premiumService.checkAndGrantPremium(user);
            
            /**
             * Here I am explicitly setting the orderItems so that the thread even 
             * runs asynchronously it wont throw lazy loading exception 
             */
            int orderItemsCount=order.getListOfOrderItems().size();
            
    		log.info("{} ordered {} items on {}",order.getUser().getUserName(), orderItemsCount, LocalDateTime.now());
            
    		// Updating the order to save Changes.
    		orderService.updateOrders(order);
    		
    		// Updating the User to save Changes ( ES Cash)
    		usersService.updateUser(user);
    		
    		realTimeNotificationService.sendNotification(Map.of(
    				"userName",user.getUserName(),
    				"orderTotal",String.valueOf(order.getTotalOrderValue()),
    				"orderId",String.valueOf(order.getOrderId())));
    		
    		try {
    			// Sending Order Summary to the user's mail ( asynchronous )
				orderEmailService.sendOrderSummary(order.getUser().getUserEmail(), order);
			} catch (MessagingException e) {
				throw new EmailSendingException(ErrorMessage.EMAIL_ERROR.getMessage());
			}
		}
		// If Failure
		else {
			// Setting the PaymentSession to 'FAILED'
			payment.setPaymentStatus(PaymentStatus.FAILED);
			
			// Canceling the order.
            orderService.cancelOrder(order.getOrderId());
            
            // Setting the PaymentSession to 'CANCELED'
            order.getPaymentSession().setPaymentSessionStatus(PaymentSessionStatus.CANCELLED);
            
    		// Updating the order to save Changes.
    		orderService.updateOrders(order);
            
            try {
            	// Sending failed message to user' mail ( asynchronous )
				orderEmailService.sendOrderFailureEmail(order.getUser().getUserEmail(), order);
			} catch (MessagingException e) {
				throw new EmailSendingException(ErrorMessage.EMAIL_ERROR.getMessage());
			}
		}
		

		return paymentMapper.toPaymentDto(paymentRepository.save(payment));
	}
		
}
