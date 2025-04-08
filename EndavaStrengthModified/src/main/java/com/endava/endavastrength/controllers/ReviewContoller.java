package com.endava.endavastrength.controllers;

import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.endava.endavastrength.dtos.ReviewDto;
import com.endava.endavastrength.response.ApiGenericResponse;
import com.endava.endavastrength.service.ReviewService;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/review")
@RequiredArgsConstructor
public class ReviewContoller {
	
	private final ReviewService reviewService;
	
	@PostMapping(consumes = "application/json",produces="application/json")
	public ResponseEntity<ApiGenericResponse> addReview(@RequestBody ReviewDto reviewDto){
		return reviewService.addReview(reviewDto);
	}
	
	@PutMapping(consumes = "application/json",produces="application/json")
	public ResponseEntity<ApiGenericResponse> editReview(@RequestBody ReviewDto reviewDto){
		return reviewService.editReview(reviewDto);
	}
	
	@DeleteMapping
	public ResponseEntity<String> deleteReview(@RequestParam long reviewId){
		return reviewService.deleteReview(reviewId);
	}
	
	@GetMapping
	public ResponseEntity<ApiGenericResponse> getReviewsOfUser(@RequestParam long userId,Pageable pageable){
		return reviewService.getAllReviewsOfUser(userId,pageable);
	}
	
}
