package com.endava.endavastrength.repositories;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

import com.endava.endavastrength.entities.Product;

@Repository
public interface ProductRepository extends JpaRepository<Product, Long> {

	List<Product> findByProductNameStartingWithIgnoreCaseAndIsActiveTrue(String name);

	@EntityGraph(attributePaths = { "subCategory", "subCategory.category" })
	@Query("SELECT p FROM Product p WHERE p.subCategory.category.categoryId = :categoryId AND p.isActive = true")
	Page<Product> findProductsByCategoryId(@Param("categoryId") long categoryId, Pageable pageable);

	@EntityGraph(attributePaths = { "subCategory", "subCategory.category" })
	@Query("SELECT p FROM Product p WHERE LOWER(p.subCategory.category.categoryName) = LOWER(:categoryName) AND p.isActive = true")
	Page<Product> findProductsByCategoryName(@Param("categoryName") String categoryName, Pageable pageable);

	Page<Product> findByProductNameContainingIgnoreCaseAndIsActiveTrue(String keyword, Pageable pageable);

	Page<Product> findAllByIsActiveTrueOrderByCreatedAtDesc(Pageable pageable);

	@Query("SELECT p FROM Product p WHERE p.createdAt >= :sevenDaysAgo AND p.isActive = true ORDER BY p.createdAt DESC")
	Page<Product> findProductsCreatedInLast7Days(@Param("sevenDaysAgo") LocalDateTime sevenDaysAgo, Pageable pageable);

	Page<Product> findByStockQuantityLessThanAndIsActiveTrueOrderByStockQuantityAsc(int stockThreshold,
			Pageable pageable);

	@Modifying
	@Query("UPDATE Product p SET p.stockQuantity = p.stockQuantity - :quantity WHERE p.productId = :productId AND p.stockQuantity >= :quantity")
	int reserveStock(@Param("productId") long productId, @Param("quantity") int quantity);

	@Modifying
	@Query("UPDATE Product p SET p.stockQuantity = p.stockQuantity + :quantity WHERE p.productId = :productId")
	void restoreStock(@Param("productId") long productId, @Param("quantity") int quantity);

	@Modifying
	@Transactional
	@Query("UPDATE Product p SET p.isActive = CASE WHEN p.isActive = true THEN false ELSE true END WHERE p.productId = :productId")
	void toggleProductActive(long productId);

	@Query("SELECT COUNT(p) FROM Product p WHERE p.stockQuantity < :threshold AND p.isActive = true")
	int countLowStockProducts(@Param("threshold") int threshold);

	boolean existsBySlug(String slug);

	Optional<Product> findBySlugAndIsActiveTrue(String slug);

	boolean existsByProductNameAndIsActiveTrue(String productName);

	@Query("""
			    SELECT p FROM Product p
			    JOIN OrderItems oi ON oi.product = p
			    JOIN Orders o ON oi.order = o
			    WHERE p.isActive = true
			    AND o.orderStatus = 'PLACED'
			    GROUP BY p
			    ORDER BY SUM(oi.quantity) DESC
			""")
	Page<Product> findTopSellingProducts(Pageable pageable);

	@Query("""
			    SELECT p FROM Product p
			    JOIN OrderItems oi ON oi.product = p
			    JOIN Orders o ON oi.order = o
			    WHERE p.isActive = true
			    AND o.orderStatus = 'PLACED'
			    AND LOWER(p.subCategory.category.categoryName) = LOWER(:categoryName)
			    GROUP BY p
			    ORDER BY SUM(oi.quantity) DESC
			""")
	Page<Product> findTopSellingProductsByCategoryName(@Param("categoryName") String categoryName, Pageable pageable);

	@EntityGraph(attributePaths = { "subCategory", "subCategory.category" })
	@Query("SELECT p FROM Product p WHERE LOWER(p.subCategory.category.categoryName) = LOWER(:categoryName) "
			+ "AND (:minPrice IS NULL OR p.basePrice >= :minPrice) "
			+ "AND (:maxPrice IS NULL OR p.basePrice <= :maxPrice) "
			+ "AND (:discountFilter IS NULL OR ((p.basePrice-p.discountedPrice)*100)/p.basePrice >= :discountFilter)"
			+ "AND (:excludeSoldOut = FALSE OR p.stockQuantity > 0) " + "AND p.isActive = true " + "ORDER BY "
			+ "CASE WHEN :sortBy = 'PLH' THEN p.basePrice END ASC, "
			+ "CASE WHEN :sortBy = 'PHL' THEN p.basePrice END DESC, "
			+ "CASE WHEN :sortBy = 'DLH' THEN p.discountedPrice END ASC, "
			+ "CASE WHEN :sortBy = 'DHL' THEN p.discountedPrice END DESC")
	Page<Product> findProductsByCategoryNameWithFilters(@Param("categoryName") String categoryName,
			@Param("minPrice") Long minPrice, @Param("maxPrice") Long maxPrice,
			@Param("discountFilter") Long discountFilter, @Param("excludeSoldOut") Boolean excludeSoldOut,
			@Param("sortBy") String sortBy, Pageable pageable);

}
