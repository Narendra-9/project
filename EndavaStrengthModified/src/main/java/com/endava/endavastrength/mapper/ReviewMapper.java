package com.endava.endavastrength.mapper;

import org.springframework.stereotype.Component;

import com.endava.endavastrength.dtos.ReviewDto;
import com.endava.endavastrength.entities.Review;

@Component
public class ReviewMapper {
	
	public Review toReview(ReviewDto reviewDto) {
		return Review.builder()
					 .reviewId(reviewDto.reviewId())
					 .rating(reviewDto.rating())
					 .title(reviewDto.title())
					 .comment(reviewDto.comment())
					 .build();
	}
	
	public ReviewDto toReviewDto(Review review) {
		return new ReviewDto(
				review.getReviewId(),
				review.getRating(),
				review.getComment(),
				review.getTitle(),
				review.getUser().getUserId(),
				review.getProduct().getProductId());
	}
}
