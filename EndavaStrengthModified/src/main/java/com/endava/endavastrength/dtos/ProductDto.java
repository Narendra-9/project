package com.endava.endavastrength.dtos;

import java.util.List;

public record ProductDto(

		long productId,

		String productName,

		long basePrice,

		long discountedPrice,

		String description,

		int stockQuantity,

		long subCategoryId,

		String primaryImg,

		List<String> listOfImageURLs) {
}
