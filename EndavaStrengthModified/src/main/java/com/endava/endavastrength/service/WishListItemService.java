package com.endava.endavastrength.service;

import java.util.List;

import com.endava.endavastrength.dtos.WishListItemDto;
import com.endava.endavastrength.dtos.WishListItemResponseDto;

public interface WishListItemService {
	
	WishListItemResponseDto addWishListItem(WishListItemDto wishListItemDtp);
	
	void deleteFromWishList(long wishListItemId);
	
	List<WishListItemResponseDto> findWishList(long userId);
	
	void moveWishListItemToCart(WishListItemDto wishListItemDto);
	
}
