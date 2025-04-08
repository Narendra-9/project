package com.endava.endavastrength.service;

import java.util.List;

import org.springframework.data.domain.Pageable;

import com.endava.endavastrength.dtos.OrdersDto;
import com.endava.endavastrength.dtos.OrdersResponseDto;
import com.endava.endavastrength.entities.Orders;
import com.endava.endavastrength.response.PagedResponse;

public interface OrderService {
	
	OrdersResponseDto createOrder(OrdersDto ordersDto);
	
	void cancelOrder(long orderId);
	
	Orders findById(long orderId);
	
	PagedResponse<OrdersResponseDto> getAllOrdersByUserId(long userId,Pageable pageable);
	
	Orders updateOrders(Orders order);
	
	void cancelOrdersBySessionIds(List<Integer> sessionIds);
	
	PagedResponse<OrdersResponseDto> getAllOrders(Pageable pageable);
	
	long getTotalSpentByUser(long userId);
	
}
