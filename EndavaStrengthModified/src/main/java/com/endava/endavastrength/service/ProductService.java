package com.endava.endavastrength.service;




import java.util.List;

import org.springframework.data.domain.Pageable;

import com.endava.endavastrength.dtos.ProductCardDisplayDto;
import com.endava.endavastrength.dtos.ProductDto;
import com.endava.endavastrength.dtos.ProductEditDto;
import com.endava.endavastrength.dtos.ProductVarientDetailsDto;
import com.endava.endavastrength.entities.Product;
import com.endava.endavastrength.response.PagedResponse;

public interface ProductService {
	
	Product addProduct(ProductDto productDto);
	
	List<Product> findAllProducts();
	
	void deleteProductById(long id);
	
	Product findProductById(long id);
	
	Product editProduct(ProductEditDto productEditDto);
	
	void toggleProductActive(long id);
	
	List<ProductVarientDetailsDto> findProductVariants(String productName);
	
	PagedResponse<ProductCardDisplayDto> findProductsByCategoryId(long categoryId,Pageable pageable);
	
	PagedResponse<ProductCardDisplayDto> findProductsByCategoryName(String categoryName,Pageable pageable);
	
	PagedResponse<ProductCardDisplayDto> findProductsByCategoryNameWithFilters(String categoryName,
			Long minPrice, Long maxPrice, Long discountFilter,
			Boolean excludeSoldOut, String sortBy, Pageable pageable);
	
	PagedResponse<ProductCardDisplayDto> findAllNewlyLaunchedProducts(Pageable pageable);
	
	PagedResponse<ProductCardDisplayDto> findByProductNameContaining(String keyword,Pageable pageable);
	
	PagedResponse<ProductCardDisplayDto> getLowStockProucts(int stockThreshold, Pageable pageable);
	
	PagedResponse<ProductCardDisplayDto> findBestSellingProducts(Pageable pageable);
	
	PagedResponse<ProductCardDisplayDto> findBestSellingProductsOfCategory(String categoryName,Pageable pageable);
	
	int reserveStock(long productId,int quantity);
	
	void restoreStock(long productId,int quantity);
	
	Product findBySlug(String slug);
	
	void updateAvgRating(Product product);
	
}
