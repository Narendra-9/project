package com.endava.endavastrength.dtos;

public record ProductVarientDetailsDto(

		long productVariantId,

		String slug,

		String flavour,

		String weight,

		long discountedPrice) {
}
