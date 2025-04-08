package com.endava.endavastrength.controllers;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import com.endava.endavastrength.dtos.CartDto;
import com.endava.endavastrength.dtos.CartItemDto;
import com.endava.endavastrength.enums.StatusMessage;
import com.endava.endavastrength.response.ApiGenericResponse;
import com.endava.endavastrength.response.ApiGenericResponseUtil;
import com.endava.endavastrength.service.CartService;

import lombok.RequiredArgsConstructor;


/**
 * Controller for handling cart-related operations.
 */
@RestController
@RequestMapping("/cart")
@RequiredArgsConstructor
public class CartController {
	
    /**
     * Service for handling cart-related operations.
     */
	private final CartService cartService;
	
    /**
     * Endpoint to fetch the cart for a given user.
     * 
     * @param userId The ID of the user whose cart is being fetched.
     * @return A response containing the cart details for the user.
     */
	@GetMapping(path = "/get-cart")
	public ResponseEntity<ApiGenericResponse> getCart(@RequestParam int userId){
		
		CartDto cart=cartService.findCartByUserId(userId);
		
		// Using the utility class to create the success response
		return ApiGenericResponseUtil.createSuccessResponse(cart,
															StatusMessage.FETCHED_CART_SUCCESSFULLY.getMessage(),
															HttpStatus.CREATED);
	}
	
	
    /**
     * Endpoint to add a product to the user's cart.
     * 
     * @param cartDto The data transfer object containing product information to be added to the cart.
     * @return A response with updated cart details after the product is added.
     */
	@PostMapping(path = "/add-to-cart",consumes = "application/json",produces="application/json")
	public ResponseEntity<ApiGenericResponse> addItemToCart(@RequestBody CartItemDto cartItemDto){
		
		CartDto cart=cartService.addToCart(cartItemDto);

		// Using the utility class to create the success response
		return ApiGenericResponseUtil.createSuccessResponse(cart, 
															StatusMessage.ADDED_TO_CART.getMessage(), 
															HttpStatus.CREATED);
	}
	
	
    /**
     * Endpoint to remove a product from the cart.
     * 
     * @param userId The ID of the user.
     * @param productId The ID of the product to be removed from the cart.
     * @return A response with updated cart details after the product is removed.
     */
	@DeleteMapping(path = "/delete-from-cart")
	public ResponseEntity<ApiGenericResponse> removeFromCart(@RequestParam int userId,@RequestParam int productId){
		
		CartDto cart=cartService.deleteFromCart(userId,productId);
		
		// Using the utility class to create the success response
		return ApiGenericResponseUtil.createSuccessResponse(cart, 
															StatusMessage.DELETED_FROM_CART.getMessage(),
															HttpStatus.OK);
	}
	
	
    /**
     * Endpoint to move an item from the cart to the wishlist.
     * 
     * @param cartItemDto Contains the information of the item to be moved to the wishlist.
     * @return A response with updated cart details after the item is moved to the wishlist.
     */
	@PostMapping(path = "move-to-wishlist",consumes = "application/json",produces = "application/json")
	public ResponseEntity<ApiGenericResponse> moveToWishList(@RequestBody CartItemDto cartItemDto){
		
		CartDto cart=cartService.moveCartItemToWishList(cartItemDto);

		// Using the utility class to create the success response
		return ApiGenericResponseUtil.createSuccessResponse(cart, 
															StatusMessage.MOVED_TO_WISHLIST.getMessage(), 
															HttpStatus.OK);
	}
	
}
