package com.endava.endavastrength.mapper;

import org.springframework.stereotype.Component;

import com.endava.endavastrength.dtos.OrderItemResponseDto;
import com.endava.endavastrength.entities.OrderItems;

import lombok.RequiredArgsConstructor;

@Component
@RequiredArgsConstructor
public class OrderItemMapper {
	
	private final ProductMapper productMapper;
	
	public OrderItemResponseDto toOrderItemDtoResponse(OrderItems orderItem) {		
		return new OrderItemResponseDto(orderItem.getOrderItemsId(),
				productMapper.toProductCardDisplayDto(orderItem.getProduct()),
				orderItem.getQuantity(),
				orderItem.getTotalPrice());
	}
}
