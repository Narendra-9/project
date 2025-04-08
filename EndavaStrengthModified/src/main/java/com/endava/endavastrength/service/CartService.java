package com.endava.endavastrength.service;


import com.endava.endavastrength.dtos.CartDto;
import com.endava.endavastrength.dtos.CartItemDto;

/**
 * Service interface for managing cart-related operations.
 */
public interface CartService {
	
    /**
     * Adds a product to the user's cart.
     *
     * @param cartItemDto The DTO containing product and user details.
     * @return The updated CartDto after adding the item.
     */
	CartDto addToCart(CartItemDto cartItemDto);
	
    /**
     * Removes a product from the user's cart.
     *
     * @param userId    The ID of the user.
     * @param productId The ID of the product to be removed.
     * @return The updated CartDto after removal.
     */
	CartDto deleteFromCart(long userId,long productId);
	
    /**
     * Retrieves the cart for a given user.
     *
     * @param userId The ID of the user whose cart is being fetched.
     * @return The CartDto containing cart details.
     */
	CartDto findCartByUserId(long userId);
	
    /**
     * Moves an item from the cart to the wishlist.
     *
     * @param cartItemDto The DTO containing product details to be moved.
     * @return The updated CartDto after the move operation.
     */
	CartDto moveCartItemToWishList(CartItemDto cartItemDto);
	
    /**
     * Clears all items from a user's cart.
     *
     * @param userId The ID of the user whose cart is to be cleared.
     */
	void clearCart(long userId);
}
