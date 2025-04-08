package com.endava.endavastrength.controllers;

import java.util.List;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import com.endava.endavastrength.dtos.DisplayBannerDto;
import com.endava.endavastrength.enums.StatusMessage;
import com.endava.endavastrength.response.ApiGenericResponse;
import com.endava.endavastrength.response.ApiGenericResponseUtil;
import com.endava.endavastrength.service.DisplayBannerService;
import lombok.RequiredArgsConstructor;

/**
 * Controller for managing display banners.
 * Provides endpoints for retrieving, adding, editing, and deleting banners.
 */
@RestController
@RequestMapping("/display-banner")
@RequiredArgsConstructor
public class DisplayBannerController {
	
	
	 /**
     * Service for managing display banners
     * This service is injected using constructor injection.
     */
	private final DisplayBannerService displayBannerService;
	
    /**
     * Retrieves all valid (active) banners.
     * 
     * @return ResponseEntity containing a list of valid banners and an HTTP status.
     */
	@GetMapping(path = "/valid-banners")
	public ResponseEntity<ApiGenericResponse> getAllValidBanners(){
		
		List<DisplayBannerDto> listOfValidBannerDtos=displayBannerService.getAllValidBanners();
		
		// Using the utility class to create the success response
		return ApiGenericResponseUtil.createSuccessResponse(listOfValidBannerDtos, 
															StatusMessage.FETCHED_ALL_VALID_BANNERS.getMessage(), 
															HttpStatus.OK);
	}
	
    /**
     * Retrieves all banners, including both active and inactive ones.
     * 
     * @return ResponseEntity containing a list of all banners and an HTTP status.
     */
	@GetMapping
	public ResponseEntity<ApiGenericResponse> getAllBanners(){
		
		List<DisplayBannerDto> listOfAllBanners=displayBannerService.getAllBanners();
		
		// Using the utility class to create the success response
		return ApiGenericResponseUtil.createSuccessResponse(listOfAllBanners, 
															StatusMessage.FETCHED_ALL_BANNERS.getMessage(), 
															HttpStatus.OK);
		
	}
	
	
    /**
     * Adds a new display banner.
     * 
     * @param displayBannerDto The banner details to be added.
     * @return ResponseEntity containing the created banner and an HTTP status.
     */
	@PostMapping(path = "/add-banner",consumes = "application/json",produces = "application/json")
	public ResponseEntity<ApiGenericResponse> addBanner(@RequestBody DisplayBannerDto displayBannerDto){
		
		DisplayBannerDto displayBannerDtoResponse=displayBannerService.addBanner(displayBannerDto);
		
		// Using the utility class to create the success response
		return ApiGenericResponseUtil.createSuccessResponse(displayBannerDtoResponse, 
															StatusMessage.BANNER_ADDED.getMessage(), 
															HttpStatus.CREATED);
		
	}
	
	
    /**
     * Edits an existing display banner.
     * 
     * @param displayBannerDto The updated banner details.
     * @return ResponseEntity containing the updated banner and an HTTP status.
     */
	@PutMapping(path = "/edit-banner",consumes = "application/json",produces = "application/json")
	public ResponseEntity<ApiGenericResponse> editBanner(@RequestBody DisplayBannerDto displayBannerDto){
		
		DisplayBannerDto displayBannerDtoResponse=displayBannerService.editBanner(displayBannerDto);
		
		// Using the utility class to create the success response
		return ApiGenericResponseUtil.createSuccessResponse(displayBannerDtoResponse, 
															StatusMessage.BANNER_EDITED.getMessage(), 
															HttpStatus.OK);
	}
	
	
    /**
     * Deletes a banner by its ID.
     * 
     * @param id The ID of the banner to be deleted.
     * @return ResponseEntity confirming deletion.
     */
	@DeleteMapping(path = "/delete-banner/{id}")
	public ResponseEntity<String> deleteBanner(@PathVariable int id){
		
		displayBannerService.deleteBanner(id);
		
		return ResponseEntity.ok(StatusMessage.BANNER_DELETED.getMessage());
	}	
	
}
