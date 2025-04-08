package com.endava.endavastrength.mapper;

import org.springframework.stereotype.Component;

import com.endava.endavastrength.dtos.CartItemResponseDto;
import com.endava.endavastrength.entities.CartItem;

import lombok.RequiredArgsConstructor;

@Component
@RequiredArgsConstructor
public class CartItemMapper {
	
	private final ProductMapper productMapper;
	
	public CartItemResponseDto toCartItemResponseDto(CartItem cartItem) {		
		return new CartItemResponseDto(cartItem.getCartItemId(),
				productMapper.toProductCardDisplayDto(cartItem.getProduct()),
				cartItem.getQuantity());
	}
}
