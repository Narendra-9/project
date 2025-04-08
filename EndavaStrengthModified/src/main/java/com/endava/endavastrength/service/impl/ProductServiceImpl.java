package com.endava.endavastrength.service.impl;

import java.time.LocalDateTime;
import java.time.temporal.ChronoUnit;
import java.util.ArrayList;
import java.util.List;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import com.endava.endavastrength.dtos.ProductCardDisplayDto;
import com.endava.endavastrength.dtos.ProductDto;
import com.endava.endavastrength.dtos.ProductEditDto;
import com.endava.endavastrength.dtos.ProductVarientDetailsDto;
import com.endava.endavastrength.entities.Product;
import com.endava.endavastrength.entities.Review;
import com.endava.endavastrength.entities.SubCategory;
import com.endava.endavastrength.enums.ErrorMessage;
import com.endava.endavastrength.exceptions.RecordAlreadyExistsException;
import com.endava.endavastrength.exceptions.RecordNotFoundException;
import com.endava.endavastrength.mapper.ProductMapper;
import com.endava.endavastrength.repositories.ProductRepository;
import com.endava.endavastrength.repositories.SubCategoryRepository;
import com.endava.endavastrength.response.PagedResponse;
import com.endava.endavastrength.service.CategoryService;
import com.endava.endavastrength.service.ProductNotificationService;
import com.endava.endavastrength.service.ProductService;
import com.endava.endavastrength.util.PaginationUtil;
import com.endava.endavastrength.util.SlugUtil;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;


/**
 * Implementation of the ProductService interface providing business logic
 * for managing products.
 */

@Slf4j
@Service
@RequiredArgsConstructor
public class ProductServiceImpl implements ProductService{
	
	
	private final ProductRepository productRepository;
	
	private final SubCategoryRepository subCategoryRepository;
	
	private final CategoryService categoryService;
	
	private final ProductNotificationService productNotificationService;
	
	private final ProductMapper productMapper;

	
    /**
     * Adds a new product.
     * 
     * @param productDto The product data transfer object.
     * @return The saved Product entity.
     */
	@Override
	public Product addProduct(ProductDto productDto) {
		
		if(productRepository.existsByProductNameAndIsActiveTrue(productDto.productName())) {
			throw new RecordAlreadyExistsException(ErrorMessage.PRODUCT_EXISTS.getMessage());
		}
		
		Product product=productMapper.toProduct(productDto);
		
		if(!productDto.productName().contains("Premium Membership")) {
			SubCategory subCategory=subCategoryRepository.findById(productDto.subCategoryId())
					.orElseThrow(()->new RecordNotFoundException(ErrorMessage.SUB_CATEGORY_NOT_FOUND.getMessage()));
			product.setSubCategory(subCategory);
		}

        String baseSlug = SlugUtil.toSlug(product.getProductName());
        String uniqueSlug = generateUniqueSlug(baseSlug);
        product.setSlug(uniqueSlug);
		return productRepository.save(product);
	}

	
    /**
     * Retrieves all products.
     * 
     * @return List of all products.
     */
	@Override
	public List<Product> findAllProducts() {
		return productRepository.findAll();
	}

	
	 /**
     * Deletes a product by its ID.
     * 
     * @param id The product ID.
     */
	@Override
	public void deleteProductById(long id) {
		productRepository.deleteById(id);
	}

	
     /**
     * Finds a product by its ID.
     * 
     * @param id The product ID.
     * @return The found Product entity.
     * @throws RecordNotFoundException If no product is found.
     */
	@Override
	public Product findProductById(long id) {
		return productRepository.findById(id).orElseThrow(()->new RecordNotFoundException(ErrorMessage.PRODUCT_NOT_EXISTS.getMessage()));
	}

	 /**
     * Finds product variants based on the product name.
     * 
     * @param productName The name of the product.
     * @return A list of product variant details.
     */
	@Override
	public List<ProductVarientDetailsDto> findProductVariants(String productName){
		String plainProductName=productName.split(",")[0].strip();
		List<Product> products= productRepository.findByProductNameStartingWithIgnoreCaseAndIsActiveTrue(plainProductName);
		List<ProductVarientDetailsDto> productVarientDetailsDtos=new ArrayList<>();
		products.stream().forEach(product->{
			String[] varientAttributes=product.getProductName().split(",");
			if(varientAttributes.length>=3) {
				String weight=varientAttributes[1].strip();
				String flavour=varientAttributes[2].strip();
				productVarientDetailsDtos.add(new ProductVarientDetailsDto(product.getProductId(),product.getSlug(), flavour, weight,product.getDiscountedPrice()));
			}
		});
		return productVarientDetailsDtos;
	
	}

     /**
     * Retrieves products based on category ID with pagination.
     * 
     * @param categoryId The category ID.
     * @param pageable Pagination details.
     * @return A paged response of product card display DTOs.
     */
	@Override
	 public PagedResponse<ProductCardDisplayDto> findProductsByCategoryId(long categoryId, Pageable pageable) {
		Page<Product> pageOfProducts=productRepository.findProductsByCategoryId(categoryId, pageable);
		
		//utility class that converts a Page<T> into a PagedResponse<T> DTO.
		return PaginationUtil.toPagedResponse(pageOfProducts.map(productMapper::toProductCardDisplayDto));
   }

     /**
     * Retrieves newly launched products within the last 7 days.
     * 
     * @param pageable Pagination details.
     * @return A paged response of product card display DTOs.
     */
	@Override
	public PagedResponse<ProductCardDisplayDto> findAllNewlyLaunchedProducts(Pageable pageable) {
		LocalDateTime sevenDaysAgo = LocalDateTime.now().minus(7, ChronoUnit.DAYS);
		Page<Product> pageOfProducts=productRepository.findProductsCreatedInLast7Days(sevenDaysAgo, pageable);
		
		//utility class that converts a Page<T> into a PagedResponse<T> DTO.
		return PaginationUtil.toPagedResponse(pageOfProducts.map(productMapper::toProductCardDisplayDto));
	}


     /**
     * Retrieves low-stock products.
     * 
     * @param stockThreshold The threshold for low stock.
     * @param pageable Pagination details.
     * @return A paged response of low-stock products.
     */
	@Override
	public PagedResponse<ProductCardDisplayDto> getLowStockProucts(int stockThreshold,Pageable pageable) {
		Page<Product> pageOfProducts=productRepository.findByStockQuantityLessThanAndIsActiveTrueOrderByStockQuantityAsc(stockThreshold, pageable);
		
		//utility class that converts a Page<T> into a PagedResponse<T> DTO.
		return PaginationUtil.toPagedResponse(pageOfProducts.map(productMapper::toProductCardDisplayDto));
	}


    /**
     * Retrieves products by category name.
     * 
     * @param categoryName The category name.
     * @param pageable Pagination details.
     * @return A paged response of products in the specified category.
     * @throws RecordNotFoundException if the product with the given categoryName is not found.
     */
	@Override
	public PagedResponse<ProductCardDisplayDto> findProductsByCategoryName(String categoryName, Pageable pageable) {
		if(!categoryService.categoryExists(categoryName)) {
			throw new RecordNotFoundException("Category doesn't exists");
		}
		Page<Product> pageOfProducts=productRepository.findProductsByCategoryName(categoryName, pageable);
		
		//utility class that converts a Page<T> into a PagedResponse<T> DTO.
		return PaginationUtil.toPagedResponse(pageOfProducts.map(productMapper::toProductCardDisplayDto));
	}

	 /**
     * Searches for products containing a keyword.
     * 
     * @param keyword The search keyword.
     * @param pageable Pagination details.
     * @return A paged response of matching products.
     */
	@Override
	public PagedResponse<ProductCardDisplayDto> findByProductNameContaining(String keyword, Pageable pageable) {
		Page<Product> pageOfProducts=productRepository.findByProductNameContainingIgnoreCaseAndIsActiveTrue(keyword, pageable);
		
		//utility class that converts a Page<T> into a PagedResponse<T> DTO.
		return PaginationUtil.toPagedResponse(pageOfProducts.map(productMapper::toProductCardDisplayDto));
	}
	
	 /**
	 * Reserves stock for a product by reducing the available quantity.
	 * 
	 * @param productId The ID of the product.
	 * @param quantity  The quantity to reserve.
	 * @return The number of affected rows in the database (1 if successful, 0 if failed).
	 */
	@Override
	public int reserveStock(long productId,int quantity) {
		return productRepository.reserveStock(productId, quantity);
	}
	
	
	 /**
	 * Restores stock for a product by increasing the available quantity.
	 * 
	 * @param productId The ID of the product.
	 * @param quantity  The quantity to restore.
	 */
	@Override
	public void restoreStock(long productId, int quantity) {
		productRepository.restoreStock(productId, quantity);
	}
	
	
	 /**
	 * Edits an existing product's price and stock details.
	 * 
	 * @param productEditDto The DTO containing updated product details.
	 * @return The updated Product entity.
	 * @throws RecordNotFoundException if the product with the given ID is not found.
	 */
	@Override
	public Product editProduct(ProductEditDto productEditDto) {
		
		Product product=productRepository.findById(productEditDto.productId())
				.orElseThrow(()->new RecordNotFoundException(ErrorMessage.PRODUCT_NOT_FOUND.getMessage()));
		
	    // Check if stock was previously 0 and is now increasing
	    boolean shouldNotify = (product.getStockQuantity() == 0) && (productEditDto.stockQuantity() > 0);
	    
		product.setBasePrice(productEditDto.basePrice());
		product.setDiscountedPrice(productEditDto.discountedPrice());
		product.setStockQuantity(productEditDto.stockQuantity());
		
	    // Save the updated product
	    Product updatedProduct = productRepository.save(product);
	    
	    //  Notifying users if stock was 0 and is now available
	    if (shouldNotify) {
	    	productNotificationService.notifyUsers(product.getProductId());
	    }
		
		return updatedProduct;
	}
	
    
    public String generateUniqueSlug(String baseSlug) {
        int counter = 1;
        String uniqueSlug = baseSlug;
        while (productRepository.existsBySlug(uniqueSlug)) {
            uniqueSlug = baseSlug + "-" + counter;
            counter++;
        }
        return uniqueSlug;
    }
    
    
	@Override
	public Product findBySlug(String slug) {
		return productRepository.findBySlugAndIsActiveTrue(slug).orElseThrow(()->new RecordNotFoundException(ErrorMessage.PRODUCT_NOT_EXISTS.getMessage()));
	}


	@Override
	public PagedResponse<ProductCardDisplayDto> findProductsByCategoryNameWithFilters(String categoryName,
			Long minPrice, Long maxPrice, Long discountFilter, Boolean excludeSoldOut, String sortBy,
			Pageable pageable) {
		
		if(!categoryService.categoryExists(categoryName)) {
			throw new RecordNotFoundException("Category doesn't exists");
		}
		Page<Product> pageOfProducts=productRepository.findProductsByCategoryNameWithFilters(categoryName,
				minPrice,
				maxPrice,
				discountFilter,
				excludeSoldOut,
				sortBy,
				pageable);
		
		//utility class that converts a Page<T> into a PagedResponse<T> DTO.
		return PaginationUtil.toPagedResponse(pageOfProducts.map(productMapper::toProductCardDisplayDto));

	}
	
	
    /**
     * Method to calculate the average rating of the product.
     * @param product the product whose average rating is to be calculated.
     */
	@Override
    public void updateAvgRating(Product product) {
        double avgRating = calculateAvgRating(product);
        product.setAvgRating(avgRating);
        productRepository.save(product); // Save the product with updated avgRating
    }

    private double calculateAvgRating(Product product) {
        List<Review> reviews = product.getListOfReviews();
        if (reviews == null || reviews.isEmpty()) {
            return 0.0;
        }
        double avgRating= reviews.stream()
                .mapToInt(Review::getRating)
                .average()
                .orElse(0.0);
        String formattedAvgRating = String.format("%.1f", avgRating);
        
        return Double.parseDouble(formattedAvgRating);
    }


	@Override
	public void toggleProductActive(long id) {
		productRepository.toggleProductActive(id);
	}


	@Override
	public PagedResponse<ProductCardDisplayDto> findBestSellingProducts(Pageable pageable) {
		
		Page<Product> pageOfProducts=productRepository.findTopSellingProducts(pageable);
		
		return PaginationUtil.toPagedResponse(pageOfProducts.map(productMapper::toProductCardDisplayDto));
	}


	@Override
	public PagedResponse<ProductCardDisplayDto> findBestSellingProductsOfCategory(String categoryName,
			Pageable pageable) {
		Page<Product> pageOfProducts=productRepository.findTopSellingProductsByCategoryName(categoryName, pageable);
		return PaginationUtil.toPagedResponse(pageOfProducts.map(productMapper::toProductCardDisplayDto));
	}

}
