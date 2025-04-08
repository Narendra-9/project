package com.endava.endavastrength.mapper;

import org.springframework.stereotype.Component;

import com.endava.endavastrength.dtos.WishListItemResponseDto;
import com.endava.endavastrength.entities.WishListItem;

import lombok.RequiredArgsConstructor;

@Component
@RequiredArgsConstructor
public class WishListItemMapper {
	

	
	private final ProductMapper productMapper;
	
	public WishListItemResponseDto toWishListItemResponseDto(WishListItem wishListItem) {
		return new WishListItemResponseDto(
				wishListItem.getUser().getUserId(),
				productMapper.toProductCardDisplayDto(wishListItem.getProduct()),
				wishListItem.getWishListItemId(),
				wishListItem.getCreatedAt());
	}
}
