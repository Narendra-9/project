package com.endava.endavastrength.controllers;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.endava.endavastrength.dtos.WishListItemDto;
import com.endava.endavastrength.dtos.WishListItemResponseDto;
import com.endava.endavastrength.enums.StatusMessage;
import com.endava.endavastrength.response.ApiGenericResponse;
import com.endava.endavastrength.response.ApiGenericResponseUtil;
import com.endava.endavastrength.service.WishListItemService;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/wishlist")
@RequiredArgsConstructor
public class WishListItemController {
	
	private final WishListItemService wishListItemService;
	
	@GetMapping("/user/{userId}")
	public ResponseEntity<ApiGenericResponse> getWishList(@PathVariable int userId){
		List<WishListItemResponseDto> wishList=wishListItemService.findWishList(userId);
		return ApiGenericResponseUtil.createSuccessResponse(wishList, 
				StatusMessage.WISHLIST_FETCHED.getMessage(), 
				HttpStatus.OK);
	}
	
	@PostMapping(path = "/addToWishList",consumes = "application/json",produces = "application/json")
	public ResponseEntity<ApiGenericResponse> addToWishList(@RequestBody WishListItemDto wishListItemDto){
		WishListItemResponseDto wishListItemResponse=wishListItemService.addWishListItem(wishListItemDto);
		return ApiGenericResponseUtil.createSuccessResponse(wishListItemResponse, 
				StatusMessage.WISHLIST_ITEM_ADDED.getMessage(), 
				HttpStatus.CREATED);
	}
	
	@DeleteMapping(path = "/deleteById/{wishListId}")
	public ResponseEntity<String> deleteFromList(@PathVariable int wishListId){
		wishListItemService.deleteFromWishList(wishListId);
		return ResponseEntity.ok(StatusMessage.WISHLIST_ITEM_DELETED.getMessage());
		
	}
	
	@PostMapping(path = "move-to-cart",consumes = "application/json",produces = "application/json")
	public ResponseEntity<String> moveToCart(@RequestBody WishListItemDto wishListItemDto){
		wishListItemService.moveWishListItemToCart(wishListItemDto);
		
		return ResponseEntity.ok(StatusMessage.MOVED_TO_CART.getMessage());
	}
}
