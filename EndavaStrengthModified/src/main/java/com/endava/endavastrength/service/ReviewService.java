package com.endava.endavastrength.service;

import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;

import com.endava.endavastrength.dtos.ReviewDto;
import com.endava.endavastrength.response.ApiGenericResponse;

public interface ReviewService {
	ResponseEntity<ApiGenericResponse> addReview(ReviewDto reviewDto);
	
	ResponseEntity<ApiGenericResponse> editReview(ReviewDto reviewDto);
	
	ResponseEntity<String> deleteReview(long reviewId);
	
	ResponseEntity<ApiGenericResponse> getAllReviewsOfUser(long userId, Pageable pageable);
	
	ResponseEntity<ApiGenericResponse> getReviewByUserIdAndProductId(long userId,long productId);
}
