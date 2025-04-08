package com.endava.endavastrength.service.impl;

import java.util.Optional;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.endava.endavastrength.dtos.CartDto;
import com.endava.endavastrength.entities.Cart;
import com.endava.endavastrength.entities.CartItem;
import com.endava.endavastrength.entities.Product;
import com.endava.endavastrength.entities.Users;
import com.endava.endavastrength.enums.ErrorMessage;
import com.endava.endavastrength.exceptions.OperationNotAllowed;
import com.endava.endavastrength.exceptions.ProductOutOfStockException;
import com.endava.endavastrength.exceptions.StillPremiumActiveException;
import com.endava.endavastrength.mapper.CartMapper;
import com.endava.endavastrength.repositories.CartRepository;
import com.endava.endavastrength.service.CartItemService;
import com.endava.endavastrength.service.PremiumCartService;

import lombok.RequiredArgsConstructor;


/**
 * Implementation of PremiumCartService responsible for handling 
 * premium membership-related cart operations.
 */
@Service
@RequiredArgsConstructor
public class PremiumCartSserviceImpl implements PremiumCartService{
	
	private final CartItemService cartItemService;
	
	private final CartMapper cartMapper;
	
	private final CartRepository cartRepository;
	
	
    /**
     * Adds a premium membership product to the user's cart.
     * Ensures that:
     * - The user does not already have an active premium membership.
     * - The premium membership is not already in the cart.
     * - The premium membership product is in stock.
     *
     * @param user The user adding the premium membership to their cart.
     * @param premiumMembership The premium membership product.
     * @return Updated CartDto containing the user's cart details.
     * @throws StillPremiumActiveException If the user already has an active premium membership.
     * @throws OperationNotAllowed If the premium membership is already in the user's cart.
     * @throws ProductOutOfStockException If the premium membership product is out of stock.
     */
	@Override
	@Transactional
	public CartDto addPremiumToCart(Users user,Product premiumMembership) {
		
		Cart cart =user.getCart();
		
		// Checks whether the user has premium and it is not expired.
		if(user.isPremiumActive()) {
			throw new StillPremiumActiveException(ErrorMessage.PREMIUM_ACTIVE.getMessage());
		}
		
		Optional<CartItem> existingCartItem=cartItemService.findByCartAndProduct(cart, premiumMembership);
		
		// checks whether the premium present in cart or not throws respective exceptions.
		if(existingCartItem.isEmpty()) {
			if(premiumMembership.getStockQuantity()>0) {
				
				CartItem cartItem=new CartItem();
				
				cartItem.setCart(cart);
				cartItem.setProduct(premiumMembership);	
				cartItem.setQuantity(1);
				cart.getCartItems().add(cartItem);
				
				return cartMapper.toCartDto(cartRepository.save(cart));
			}else {
				throw new ProductOutOfStockException(ErrorMessage.PRODUCT_OUT_OF_STOCK.getMessage());
			}
		}else {
			throw new OperationNotAllowed(ErrorMessage.PREMIUM_EXISTS_IN_CART.getMessage());
		}
	}

	
}
