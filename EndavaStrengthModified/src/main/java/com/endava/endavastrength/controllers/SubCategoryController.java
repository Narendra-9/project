package com.endava.endavastrength.controllers;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.endava.endavastrength.dtos.SubCategoryDto;
import com.endava.endavastrength.dtos.SubCategoryResponseDto;
import com.endava.endavastrength.enums.StatusMessage;
import com.endava.endavastrength.response.ApiGenericResponse;
import com.endava.endavastrength.response.ApiGenericResponseUtil;
import com.endava.endavastrength.service.SubCategoryService;

import lombok.RequiredArgsConstructor;


/**
 * Controller responsible for handling HTTP requests related to subcategories.
 */
@RestController
@RequestMapping("/sub-category")
@RequiredArgsConstructor
public class SubCategoryController {
	
	
	private final SubCategoryService subCategoryService;
	
	
    /**
     * Adds a new subcategory.
     * 
     * @param subCategoryDto the data transfer object containing the details of the subcategory to be added.
     * @return a ResponseEntity containing the success response with the details of the added subcategory.
     */
	@PostMapping(consumes = "application/json",produces = "application/json")
	public ResponseEntity<ApiGenericResponse> addSubCategory(@RequestBody SubCategoryDto subCategoryDto) {
		 return ApiGenericResponseUtil.createSuccessResponse(subCategoryService.addSubCategory(subCategoryDto),
				 StatusMessage.SUBCATEGORY_ADDED.getMessage(),
				 HttpStatus.OK);
	}
	
	
    /**
     * Retrieves a subcategory along with its associated products.
     * 
     * @param subCategoryName the name of the subcategory whose details are to be retrieved.
     * @return a ResponseEntity containing the success response with the details of the subcategory and its products.
     */
	@GetMapping
	public ResponseEntity<ApiGenericResponse> getSubCategoryWithProducts(@RequestParam String subCategoryName) {
		SubCategoryResponseDto subCategoryResponseDto=subCategoryService.getSubCategoryWithProducts(subCategoryName);
		return ApiGenericResponseUtil.createSuccessResponse(subCategoryResponseDto, StatusMessage.SUBCATEGORY_WITH_PRODUCTS.getMessage(), HttpStatus.OK);
	}
	
	
    /**
     * Deletes a subcategory by its ID.
     * 
     * @param id the ID of the subcategory to be deleted.
     * @return a ResponseEntity containing the success response indicating that the subcategory has been deleted.
     */
	@DeleteMapping(path = {"deleteById/{id}"})
	public ResponseEntity<String> deleteCategoryById(@PathVariable int id ) {
		subCategoryService.deleteSubCategoryById(id);
		return ResponseEntity.ok(StatusMessage.SUBCATEGORY_DELETED.getMessage());
	}
}
