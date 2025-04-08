package com.endava.endavastrength.dtos;

public record CartItemResponseDto(long cartItemId, ProductCardDisplayDto product, long quantity) {
}
