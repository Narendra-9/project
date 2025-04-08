package com.endava.endavastrength.repositories;


import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

import com.endava.endavastrength.entities.Category;

@Repository
public interface CategoryRepository extends JpaRepository<Category, Long>{
	
	boolean existsByCategoryNameIgnoreCase(String categoryName);
	
	Optional<Category> findByCategoryNameIgnoreCase(String categoryName);
	
	@Modifying
	@Transactional
	@Query("UPDATE Category c SET c.isActive=false where categoryId=:categoryId")
	void discontinueCategory(long categoryId);
}
