package com.endava.endavastrength.dtos;

public record ReviewDto(

		long reviewId,

		int rating,

		String comment,

		String title,

		long userId,

		long productId

) {
}
