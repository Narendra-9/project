package com.endava.endavastrength.dtos;

public record ProductEditDto(

		long productId,

		long basePrice,

		long discountedPrice,

		int stockQuantity

) {
}
