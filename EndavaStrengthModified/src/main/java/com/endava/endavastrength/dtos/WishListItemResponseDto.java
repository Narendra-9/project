package com.endava.endavastrength.dtos;

import java.time.LocalDateTime;

public record WishListItemResponseDto(

		long userId,

		ProductCardDisplayDto product,

		long wishListItemId,

		LocalDateTime createdAt) {
}
