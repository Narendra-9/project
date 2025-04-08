package com.endava.endavastrength.mapper;

import org.springframework.stereotype.Component;

import com.endava.endavastrength.dtos.OrdersResponseDto;
import com.endava.endavastrength.entities.Orders;

import lombok.RequiredArgsConstructor;

@Component
@RequiredArgsConstructor
public class OrdersMapper {
	
	private final UserAddressMapper userAddressMapper;
	
	private final OrderItemMapper orderItemMapper;
	
	private final PaymentMapper paymentMapper;
	
	private final PaymentSessionMapper paymentSessionMapper;
	
	public OrdersResponseDto toOrdersResponseDto(Orders orders) {
		return new OrdersResponseDto(
				orders.getOrderId(),
				orders.getListOfOrderItems().stream()
				  .map(orderItemMapper::toOrderItemDtoResponse)
				  .toList(),
				userAddressMapper.toAddressDto(orders.getUserAddress()),
				orders.getOrderStatus(), 
				orders.getTotalPrice(),
				paymentMapper.toPaymentDto(orders.getPayment()),
				paymentSessionMapper.toPaymentSessionDto(orders.getPaymentSession()),
				orders.getCreatedAt());
	}
	
	
	public OrdersResponseDto toCreateOrdersResponseDto(Orders orders) {
		
		return new OrdersResponseDto(
				orders.getOrderId(),
				orders.getListOfOrderItems().stream()
				  .map(orderItemMapper::toOrderItemDtoResponse)
				  .toList(),
				userAddressMapper.toAddressDto(orders.getUserAddress()),
				orders.getOrderStatus(), 
				orders.getTotalPrice(),
				null,
				null,
				orders.getCreatedAt());
		
	}
}
