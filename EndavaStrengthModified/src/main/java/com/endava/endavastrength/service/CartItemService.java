package com.endava.endavastrength.service;

import java.util.Optional;


import com.endava.endavastrength.entities.Cart;
import com.endava.endavastrength.entities.CartItem;
import com.endava.endavastrength.entities.Product;

public interface CartItemService {
	
	Optional<CartItem> findByCartAndProduct(Cart cart,Product product);
	
	CartItem updateCartItem(CartItem cartItem);
	
	CartItem addCartItem(CartItem cartItem);
	
	void deleteCartItem(CartItem cartItem);
}
