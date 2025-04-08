package com.endava.endavastrength.dtos;

public record ProductCardDisplayDto(

		long productId,

		String productName,

		String slug,

		long basePrice,

		long discoutedPrice,

		int stockQuantity,

		String primaryImageUrl,

		Double avgRating

) {}
