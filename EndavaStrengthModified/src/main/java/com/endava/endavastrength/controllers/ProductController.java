package com.endava.endavastrength.controllers;


import java.util.List;

import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.endava.endavastrength.dtos.ProductCardDisplayDto;
import com.endava.endavastrength.dtos.ProductDto;
import com.endava.endavastrength.dtos.ProductEditDto;
import com.endava.endavastrength.dtos.ProductVarientDetailsDto;
import com.endava.endavastrength.entities.Product;
import com.endava.endavastrength.enums.ApiPaths;
import com.endava.endavastrength.enums.StatusMessage;
import com.endava.endavastrength.response.ApiGenericResponse;
import com.endava.endavastrength.response.ApiGenericResponseUtil;
import com.endava.endavastrength.response.PagedResponse;
import com.endava.endavastrength.service.ProductService;

import lombok.RequiredArgsConstructor;


/**
 * Controller for handling product-related operations in the e-commerce system.
 */
@RestController
@RequestMapping(ApiPaths.PRODUCTS)
@RequiredArgsConstructor
public class ProductController {
	
	
    /**
     * Service for managing products
     */
	private final ProductService productService;
	
	
    /**
     * Retrieves all products.
     * @return ResponseEntity containing a list of all products.
     */
	@GetMapping
	public ResponseEntity<ApiGenericResponse> getAllProducts(){
		
		List<Product> listOfProducts=productService.findAllProducts();
		
		// Using the utility class to create the success response
		return ApiGenericResponseUtil.createSuccessResponse(listOfProducts,
															StatusMessage.FETCHED_ALL_PRODUCTS.getMessage(),
															HttpStatus.OK);
	}
	
	
	@GetMapping(path = ApiPaths.SLUG)
	public ResponseEntity<ApiGenericResponse> findProductBySlug(@RequestParam String slug){

		Product product=productService.findBySlug(slug);

		// Using the utility class to create the success response
		return ApiGenericResponseUtil.createSuccessResponse(product,
				StatusMessage.FETCHED_PRODUCT.getMessage(),
				HttpStatus.OK);
	}
	
	
	 /**
     * Adds a new product.
     * @param productDto The product details.
     * @return ResponseEntity containing the newly added product.
     */
	@PostMapping(consumes = "application/json",produces = "application/json")
	public ResponseEntity<ApiGenericResponse> addProduct(@RequestBody ProductDto productDto) {

		Product product=productService.addProduct(productDto);
		// Using the utility class to create the success response
		return ApiGenericResponseUtil.createSuccessResponse(product,
															StatusMessage.PRODUCT_ADDED.getMessage(),
															HttpStatus.CREATED);
	}
	
	
    /**
     * Updates an existing product.
     * @param productEditDto The product details to update.
     * @return ResponseEntity containing the updated product.
     */
	@PutMapping(path = ApiPaths.EDIT_PRODUCT,consumes = "application/json",produces = "application/json")
	public ResponseEntity<ApiGenericResponse> editProduct(@RequestBody ProductEditDto productEditDto) {
		
		Product product=productService.editProduct(productEditDto);
		
		// Using the utility class to create the success response
		return ApiGenericResponseUtil.createSuccessResponse(product,
															StatusMessage.PRODUCT_EDITED.getMessage(),
															HttpStatus.OK);
	}
	

    /**
     * Retrieves products belonging to a specific category by category ID.
     * @param categoryId The ID of the category.
     * @param pageable Pagination details.
     * @return ResponseEntity containing the list of products in the category.
     */
	@GetMapping(ApiPaths.PRODUCTS_BY_CATEGORYID)
	public ResponseEntity<ApiGenericResponse> getAllProductsOfCategoryPage(@PathVariable int categoryId,Pageable pageable){
		
		PagedResponse<ProductCardDisplayDto> listOfProductsOfCategory=productService.findProductsByCategoryId(categoryId,pageable);
		
		// Using the utility class to create the success response
		return ApiGenericResponseUtil.createSuccessResponse(listOfProductsOfCategory,
															StatusMessage.FETCHED_CATEGORY_PRODUCTS.getMessage(),
															HttpStatus.OK);
	}
	
	
	
	 /**
     * Retrieves products belonging to a specific category by category name.
     * @param categoryName The name of the category.
     * @param pageable Pagination details.
     * @return ResponseEntity containing the list of products in the category.
     */
	@GetMapping(ApiPaths.PRODUCTS_BY_CATEGORY_NAME)
	public ResponseEntity<ApiGenericResponse> getAllProductsOfCategoryPageByCategoryName(@PathVariable String categoryName,Pageable pageable){
		
		PagedResponse<ProductCardDisplayDto> listOfProductsOfCategory=productService.findProductsByCategoryName(categoryName, pageable);
		
		// Using the utility class to create the success response
		return ApiGenericResponseUtil.createSuccessResponse(listOfProductsOfCategory,
															StatusMessage.FETCHED_CATEGORY_PRODUCTS.getMessage(),
															HttpStatus.OK);
	}
	
	
    @GetMapping(ApiPaths.FILTER)
    public ResponseEntity<ApiGenericResponse> getProductsByCategoryWithFilters(
            @RequestParam String categoryName,
            @RequestParam(required = false) Long minPrice,
            @RequestParam(required = false) Long maxPrice,
            @RequestParam(required = false) Long discountFilter,
            @RequestParam(required = false) Boolean excludeSoldOut,
            @RequestParam(required = false) String sortBy,
            Pageable pageable) {
        // Calling the service method to retrieve the filtered products
        PagedResponse<ProductCardDisplayDto> response = productService
                .findProductsByCategoryNameWithFilters(categoryName, minPrice, maxPrice, discountFilter, excludeSoldOut, sortBy, pageable);

        return ApiGenericResponseUtil.createSuccessResponse(response, StatusMessage.FETCHED_CATEGORY_PRODUCTS.getMessage(), HttpStatus.OK);
    }
	
    /**
     * Retrieves newly launched products.
     * @param pageable Pagination details.
     * @return ResponseEntity containing the list of newly launched products.
     */
	@GetMapping(ApiPaths.NEWLY_LAUNCHED)
	public ResponseEntity<ApiGenericResponse> getAllNewlyLaunched(Pageable pageable){

		PagedResponse<ProductCardDisplayDto> listOfNewlyLaunchedProducts=productService.findAllNewlyLaunchedProducts(pageable);

		// Using the utility class to create the success response
		return ApiGenericResponseUtil.createSuccessResponse(listOfNewlyLaunchedProducts,
				StatusMessage.FETCHED_NEWLY_LAUNCHED.getMessage(),
				HttpStatus.OK);
	}
	
	
    /**
     * Retrieves products containing a specific keyword in their name.
     * @param keyword The search keyword.
     * @param pageable Pagination details.
     * @return ResponseEntity containing the list of matching products.
     */
	@GetMapping(ApiPaths.CONTAINING)
	public ResponseEntity<ApiGenericResponse> getAllProductsContaining(@RequestParam String keyword, Pageable pageable){
		
		PagedResponse<ProductCardDisplayDto> lisOfProductsContainingKeyword=productService.findByProductNameContaining(keyword, pageable);
		
		// Using the utility class to create the success response
		return ApiGenericResponseUtil.createSuccessResponse(lisOfProductsContainingKeyword,
				StatusMessage.FETCHED_SEARCHED_KEYWORD.getMessage(),
				HttpStatus.OK);
	}
	
	
    /**
     * Retrieves products that are low in stock.
     * @param stockThreshold The stock threshold (default 10).
     * @param pageable Pagination details.
     * @return ResponseEntity containing the list of low stock products.
     */
	@GetMapping(ApiPaths.LOW_STOCK)
	public ResponseEntity<ApiGenericResponse> getAllLowStockProducts(
			@RequestParam(defaultValue = "10") int stockThreshold,
			Pageable pageable){

		PagedResponse<ProductCardDisplayDto> listOfLowStockProducts=productService.getLowStockProucts(stockThreshold, pageable);

		// Using the utility class to create the success response
		return ApiGenericResponseUtil.createSuccessResponse(listOfLowStockProducts,
				StatusMessage.FETCHED_LOW_STOCK_PRODUCTS.getMessage(),
				HttpStatus.OK);
	}
	
	@GetMapping(ApiPaths.BEST_SELLING)
	public ResponseEntity<ApiGenericResponse> getBestSellingProducts(Pageable pageable){

		PagedResponse<ProductCardDisplayDto> listOfBestSellingProducts=productService.findBestSellingProducts(pageable);

		// Using the utility class to create the success response
		return ApiGenericResponseUtil.createSuccessResponse(listOfBestSellingProducts,
				StatusMessage.FETCHED_LOW_STOCK_PRODUCTS.getMessage(),
				HttpStatus.OK);
	}
	
	
	@GetMapping(ApiPaths.BEST_SELLING_OF_CATEGORY)
	public ResponseEntity<ApiGenericResponse> getBestSellingProductsOfCategory(@PathVariable String categoryName,Pageable pageable){

		PagedResponse<ProductCardDisplayDto> listOfBestSellingProductsOfCategory=productService.findBestSellingProductsOfCategory(categoryName,pageable);

		// Using the utility class to create the success response
		return ApiGenericResponseUtil.createSuccessResponse(listOfBestSellingProductsOfCategory,
				StatusMessage.FETCHED_LOW_STOCK_PRODUCTS.getMessage(),
				HttpStatus.OK);
	}
	

	
    /**
     * Retrieves product variants for a given product name.
     * @param productName The product name.
     * @return ResponseEntity containing the list of product variants.
     */
	@GetMapping(path = ApiPaths.PRODUCT_VARIANTS)
	public ResponseEntity<ApiGenericResponse> findProductVariants(@RequestParam String productName){
		
		List<ProductVarientDetailsDto> listOfProductVarients=productService.findProductVariants(productName);
		
		// Using the utility class to create the success response
		return ApiGenericResponseUtil.createSuccessResponse(listOfProductVarients,
				StatusMessage.FETCHED_PRODUCT_VARIENTS.getMessage(),
				HttpStatus.OK);
	}
	
	
	/**
	 * Marks a product as discontinued (inactive) by setting its {isActive} flag to {false}.
	 * This allows soft deletion of products instead of removing them from the database.
	 *
	 * @param id The unique identifier of the product to be discontinued.
	 * @return A ResponseEntity containing a success message upon successful discontinuation.
	 */
	@PutMapping(path = ApiPaths.PRODUCT_TOGGLE_ACTIVE)
	public ResponseEntity<String> toggleProductActive(@PathVariable long id){
		productService.toggleProductActive(id);
		return ResponseEntity.ok(StatusMessage.DISCONTINUE_PRODUCT.getMessage());
	}
}
