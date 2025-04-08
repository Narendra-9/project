package com.endava.endavastrength.dtos;

public record OrderItemResponseDto(
		long orderItemsId,
		ProductCardDisplayDto product,
		int quantity,
		long totalPrice) {
}
