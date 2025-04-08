package com.endava.endavastrength.mapper;

import org.springframework.stereotype.Component;

import com.endava.endavastrength.dtos.CartDto;
import com.endava.endavastrength.entities.Cart;

import lombok.RequiredArgsConstructor;

@Component
@RequiredArgsConstructor
public class CartMapper {
	
	private final CartItemMapper cartItemMapper;

	public CartDto toCartDto(Cart cart) {
		return new CartDto(cart.getCartId(), cart.getCartItems().stream()
					.map(cartItemMapper::toCartItemResponseDto)
					.toList());
					  
	}
}
