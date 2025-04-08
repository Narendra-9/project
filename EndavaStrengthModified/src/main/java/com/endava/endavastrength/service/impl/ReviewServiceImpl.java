package com.endava.endavastrength.service.impl;

import java.util.Optional;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import com.endava.endavastrength.dtos.ReviewDto;
import com.endava.endavastrength.entities.Product;
import com.endava.endavastrength.entities.Review;
import com.endava.endavastrength.enums.ErrorMessage;
import com.endava.endavastrength.enums.StatusMessage;
import com.endava.endavastrength.mapper.ReviewMapper;
import com.endava.endavastrength.repositories.ReviewRepository;
import com.endava.endavastrength.response.ApiGenericResponse;
import com.endava.endavastrength.response.ApiGenericResponseUtil;
import com.endava.endavastrength.service.OrderItemsService;
import com.endava.endavastrength.service.ProductService;
import com.endava.endavastrength.service.ReviewService;
import com.endava.endavastrength.service.UsersService;
import com.endava.endavastrength.util.PaginationUtil;

import lombok.RequiredArgsConstructor;

/**
 * Implementation of the ReviewService interface.
 * Handles operations related to product reviews, such as adding, editing, retrieving, and deleting reviews.
 */
@Service
@RequiredArgsConstructor
public class ReviewServiceImpl implements ReviewService{
	
	private final ReviewRepository reviewRepository;
	
	private final UsersService usersService;
	
	private final ProductService productService;
	
	private final OrderItemsService orderItemsService;
	
	private final ReviewMapper reviewMapper;
	

	/**
	 * Adds or updates a product review based on the provided {@link ReviewDto}.
	 * 
	 * If the review is being added for the first time, a new review is created and saved. 
	 * If the user has already posted a review for the given product, the existing review is updated with the new details.
	 * 
	 * The method checks:
	 * - If the user ID and product ID are valid.
	 * - If the user has purchased the product.
	 * 
	 * @param reviewDto The data transfer object containing the review details to be added or updated.
	 * @return A ResponseEntity containing an ApiGenericResponse with the status of the operation.
	 */
	@Override
	public ResponseEntity<ApiGenericResponse> addReview(ReviewDto reviewDto) {
		
		if(reviewDto.userId()==0) {
			return ApiGenericResponseUtil.createErrorResponse(ErrorMessage.USER_NOT_FOUND.getMessage(),
					HttpStatus.NOT_ACCEPTABLE);
		}
		
		if(reviewDto.productId()==0) {
			return ApiGenericResponseUtil.createErrorResponse(ErrorMessage.PRODUCT_NOT_FOUND.getMessage(),
					HttpStatus.NOT_ACCEPTABLE);
		}
				
		if(!orderItemsService.itemExistsInOrderHistory(reviewDto.userId(), reviewDto.productId())) {
			return ApiGenericResponseUtil.createErrorResponse(ErrorMessage.NOT_ORDERED.getMessage(),
					HttpStatus.NOT_ACCEPTABLE);
		}
		
		Optional<Review> reviewOpt= reviewRepository
				.findByUserUserIdAndProductProductId(reviewDto.userId(), reviewDto.productId());
		
		if(reviewOpt.isEmpty()) {
			Review review=reviewMapper.toReview(reviewDto);
			Product product=productService.findProductById(reviewDto.productId());
			
			review.setUser(usersService.fetchUserDetails(reviewDto.userId()));
			review.setProduct(product);
			
			Review savedReview=reviewRepository.save(review);
			
			productService.updateAvgRating(product);
			
			return ApiGenericResponseUtil.createSuccessResponse(reviewMapper.toReviewDto(savedReview),
					StatusMessage.REVIEW_POSTED.getMessage(),
					HttpStatus.CREATED);
		}
		else{
			Review existingReview=reviewOpt.get();
			
			existingReview.setComment(reviewDto.comment());
			existingReview.setRating(reviewDto.rating());
			existingReview.setTitle(reviewDto.title());

			
			Review savedReview=reviewRepository.save(existingReview);
			
			productService.updateAvgRating(savedReview.getProduct());
			
			return ApiGenericResponseUtil.createSuccessResponse(reviewMapper.toReviewDto(savedReview),
					StatusMessage.REVIEW_POSTED.getMessage(),
					HttpStatus.CREATED);
		}
		

	}

    /**
     * Edits an existing review if found.
     *
     * @param reviewDto The review data transfer object containing updated review details.
     * @return ResponseEntity containing the updated review or an error message if the review is not found.
     */
	@Override
	public ResponseEntity<ApiGenericResponse> editReview(ReviewDto reviewDto) {
		
		Optional<Review> existingReviewRecord=reviewRepository.findById(reviewDto.reviewId());
		
		if(existingReviewRecord.isPresent()) {
			Review existingReview=existingReviewRecord.get();
			existingReview.setComment(reviewDto.comment());
			existingReview.setRating(reviewDto.rating());
			
			return ApiGenericResponseUtil.createSuccessResponse(reviewMapper
					.toReviewDto(reviewRepository.save(existingReview)),
					StatusMessage.REVIEW_EDITED.getMessage(), HttpStatus.OK);
		}
		else {
			return ApiGenericResponseUtil.createErrorResponse(ErrorMessage.REVIEW_NOT_FOUND.getMessage(),
					HttpStatus.NOT_FOUND);
		}
		
	}

	
    /**
     * Deletes a review by its ID.
     *
     * @param reviewId The ID of the review to be deleted.
     * @return ResponseEntity containing a success message.
     */
	@Override
	public ResponseEntity<String> deleteReview(long reviewId) {
		reviewRepository.deleteById(reviewId);
		return ResponseEntity.ok(StatusMessage.REVIEW_DELETED.getMessage());
		
	}

    /**
     * Retrieves all reviews posted by a specific user.
     *
     * @param userId   The ID of the user whose reviews are to be retrieved.
     * @param pageable The pagination information.
     * @return ResponseEntity containing a paginated list of the 
     * user's reviews or an error message if the user is not found.
     */
	@Override
	public ResponseEntity<ApiGenericResponse> getAllReviewsOfUser(long userId,Pageable pageable) {
		
		if(!usersService.userExists(userId)) {
			return ApiGenericResponseUtil.createErrorResponse(ErrorMessage.USER_NOT_FOUND.getMessage(),
					HttpStatus.NOT_FOUND);
		}
		Page<Review> pageOfReviews=reviewRepository.findByUserUserId(userId, pageable);
		return ApiGenericResponseUtil.createSuccessResponse(PaginationUtil
				.toPagedResponse(pageOfReviews.map(reviewMapper::toReviewDto)),
				StatusMessage.USER_REVIEWS_FETCHED.getMessage(),
				HttpStatus.OK);
	}

    /**
     * Retrieves a specific review by a user for a given product.
     *
     * @param userId    The ID of the user.
     * @param productId The ID of the product.
     * @return ResponseEntity containing the review details or an error message if the review does not exist.
     */
	@Override
	public ResponseEntity<ApiGenericResponse> getReviewByUserIdAndProductId(long userId, long productId) {
		Optional<Review> reviewOpt= reviewRepository.findByUserUserIdAndProductProductId(userId, productId);
		
		if(reviewOpt.isPresent()) {
			return ApiGenericResponseUtil.createSuccessResponse(reviewOpt.get(),
					StatusMessage.REVIEW_FETCHED.getMessage(), HttpStatus.OK);
		}
		else {
			return ApiGenericResponseUtil.createErrorResponse(ErrorMessage.REVIEW_NOT_EXISITS.getMessage(),
					HttpStatus.NOT_FOUND);
		}
	}

}
