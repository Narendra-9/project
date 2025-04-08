package com.endava.endavastrength.service.impl;

import java.util.Optional;

import org.springframework.stereotype.Service;

import com.endava.endavastrength.entities.Cart;
import com.endava.endavastrength.entities.CartItem;
import com.endava.endavastrength.entities.Product;
import com.endava.endavastrength.repositories.CartItemRepository;
import com.endava.endavastrength.service.CartItemService;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class CartItemServiceImpl implements CartItemService{
	

	private final CartItemRepository cartItemRepository;
	
	@Override
	public Optional<CartItem> findByCartAndProduct(Cart cart, Product product) {
		return cartItemRepository.findByCartAndProduct(cart, product);
	}

	@Override
	public CartItem updateCartItem(CartItem cartItem) {
		return cartItemRepository.save(cartItem);
	}

	@Override
	public CartItem addCartItem(CartItem cartItem) {
		return cartItemRepository.save(cartItem);
	}

	@Override
	public void deleteCartItem(CartItem cartItem) {
		cartItemRepository.delete(cartItem);
	}

}
