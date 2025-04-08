package com.endava.endavastrength.service.impl;

import java.util.Map;
import java.util.Optional;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.endava.endavastrength.dtos.CartDto;
import com.endava.endavastrength.dtos.CartItemDto;
import com.endava.endavastrength.dtos.WishListItemDto;
import com.endava.endavastrength.entities.Cart;
import com.endava.endavastrength.entities.CartItem;
import com.endava.endavastrength.entities.Product;
import com.endava.endavastrength.entities.Users;
import com.endava.endavastrength.enums.ErrorMessage;
import com.endava.endavastrength.exceptions.ProductNotInCartException;
import com.endava.endavastrength.exceptions.ProductOutOfStockException;
import com.endava.endavastrength.mapper.CartMapper;
import com.endava.endavastrength.repositories.CartRepository;
import com.endava.endavastrength.service.CartItemService;
import com.endava.endavastrength.service.CartService;
import com.endava.endavastrength.service.PremiumService;
import com.endava.endavastrength.service.ProductService;
import com.endava.endavastrength.service.RealTimeNotificationService;
import com.endava.endavastrength.service.UsersService;
import com.endava.endavastrength.service.WishListItemService;

import lombok.RequiredArgsConstructor;

/**
 * Implementation of CartService that handles all cart-related operations.
 * Provides functionalities such as adding/removing products from the cart,
 * moving items to the wishlist, and clearing the cart.
 */
@Service
@RequiredArgsConstructor
public class CartServiceImpl implements CartService{
	
	
	private final CartRepository cartRepository;
	
	private final UsersService usersService;
	
	private final ProductService productService;
	
	private final CartItemService cartItemService;
	
	private final WishListItemService wishListItemService;
	
	private final PremiumService premiumService;
	
	private final CartMapper cartMapper;
	
	private final RealTimeNotificationService realTimeNotificationService;
	
    /**
     * Adds a product to the user's cart.
     *
     * @param cartItemDto DTO containing user ID, product ID, and quantity.
     * @return Updated CartDto after adding the product.
     * @throws ProductOutOfStockException if the requested quantity exceeds available stock.
     */
	@Transactional
	@Override
	public CartDto addToCart(CartItemDto cartItemDto) {
		
		Users user=usersService.fetchUserDetails(cartItemDto.userId());
		
		//getting the cart by user(one-to-one)
		Cart cart=user.getCart();
		
		Product product=productService.findProductById(cartItemDto.productId());
		
	    // Checking if the product is premium, redirecting to `addPremiumToCart()`
	    if (product.getSlug().equalsIgnoreCase("mb-premium-membership-12-months")) {
	    	
	    	// This method should be transactional , so we need to put in different service and use it.
	        return premiumService.addPremiumToCart(user.getUserId());
	    }
		
		// Checking stock availability before adding to cart
		if(cartItemDto.quantity()<=product.getStockQuantity()) {
			
			// Checking for existing product.	
			Optional<CartItem> cartItemRecord=cartItemService.findByCartAndProduct(cart, product);
			
			//If existing product is present
			if(cartItemRecord.isPresent()) {
				
				CartItem existingCartItem=cartItemRecord.get();
				
				// Adding the request quantity to the existing product.
				int newQuantity=existingCartItem.getQuantity()+cartItemDto.quantity();
				
				//checking the stock availability by adding the pre-existing quantity of item in cart 
				if(newQuantity<=product.getStockQuantity() && newQuantity>0) {
					existingCartItem.setQuantity(existingCartItem.getQuantity()+cartItemDto.quantity());
		            cartItemService.updateCartItem(existingCartItem);
				}
				else {
					throw new ProductOutOfStockException(ErrorMessage.PRODUCT_OUT_OF_STOCK.getMessage());
				}
				
			}
			else {
				
				//If there's no cartItem already present then creating a new one and adding to cart
				CartItem cartItem=new CartItem();
				cartItem.setCart(cart);
				cartItem.setProduct(product);	
				cartItem.setQuantity(cartItemDto.quantity());
				cart.getCartItems().add(cartItem);
			}
			realTimeNotificationService.sendNotification(Map.of(
					"userName",user.getUserName(),
    				"orderTotal","123",
    				"orderId","1"));
			
			return cartMapper.toCartDto(cartRepository.save(cart));
			
		}else {
			throw new ProductOutOfStockException(ErrorMessage.PRODUCT_OUT_OF_STOCK.getMessage());
		}
	}
	
	
	
    /**
     * Deletes a product from the user's cart.
     *
     * @param userId    The ID of the user.
     * @param productId The ID of the product to be removed.
     * @return Updated CartDto after removing the product.
     * @throws ProductNotInCartException if the product is not found in the cart.
     */
	@Override
	@Transactional
	public CartDto deleteFromCart(long userId,long productId) {

		Users user=usersService.fetchUserDetails(userId);
		Cart cart=user.getCart();
		Product product=productService.findProductById(productId);
		
		Optional<CartItem> existingCartItemRecord = cartItemService.findByCartAndProduct(cart, product);
		
		if(existingCartItemRecord.isPresent()) {
			CartItem existingCartItem=existingCartItemRecord.get();
			cart.getCartItems().remove(existingCartItem);
	        return cartMapper.toCartDto(cartRepository.save(cart));
		}
		else {
			throw new ProductNotInCartException(ErrorMessage.PRODUCT_NOT_IN_CART.getMessage());
		}
	}

	
    /**
     * Retrieves the cart for a given user.
     *
     * @param userId The ID of the user.
     * @return The CartDto representing the user's cart.
     */
	@Override
	public CartDto findCartByUserId(long userId) {
		Users users=usersService.fetchUserDetails(userId);
		return cartMapper.toCartDto(cartRepository.findByUser(users));
	}

	
	
    /**
     * Moves an item from the cart to the wishlist.
     *
     * @param cartItemDto DTO containing user ID and product ID.
     * @return Updated CartDto after moving the item.
     * @throws ProductNotInCartException if the product is not found in the cart.
     */
	@Override
	@Transactional
	public CartDto moveCartItemToWishList(CartItemDto cartItemDto) {
		
		Users user = usersService.fetchUserDetails(cartItemDto.userId());
		
	    Cart cart = user.getCart();
	    
	    Product product = productService.findProductById(cartItemDto.productId());

	    Optional<CartItem> cartItemOpt = cartItemService.findByCartAndProduct(cart, product);
	    
	    if (cartItemOpt.isEmpty()) {
	        throw new ProductNotInCartException(ErrorMessage.PRODUCT_NOT_IN_CART.getMessage());
	    }
	    
	    //Removing from Cart
	    CartItem cartItem = cartItemOpt.get();
	    cart.getCartItems().remove(cartItem);
	    cartItemService.deleteCartItem(cartItem);
	    
	    //Adding to WishList
	    WishListItemDto wishListItem = new WishListItemDto(user.getUserId(),product.getProductId());
	    wishListItemService.addWishListItem(wishListItem);

	    // Saving cart after modification
	    return cartMapper.toCartDto(cartRepository.save(cart));
	}

	
    /**
     * Clears all items from the user's cart.
     *
     * @param userId The ID of the user whose cart will be cleared.
     */
	@Override
	public void clearCart(long userId) {
		
		Users user = usersService.fetchUserDetails(userId);
		
	    Cart cart = user.getCart();
	    
	    if (cart != null && cart.getCartItems() != null) {
	        for (CartItem item : cart.getCartItems()) {
	            cartItemService.deleteCartItem(item);
	        }
	        
	        cart.getCartItems().clear();
	       
	        cartRepository.save(cart);
	    }
		
	}

}
