package com.endava.endavastrength.dtos;

import java.util.List;

public record CartDto(long cartId, List<CartItemResponseDto> cartItems) {
}