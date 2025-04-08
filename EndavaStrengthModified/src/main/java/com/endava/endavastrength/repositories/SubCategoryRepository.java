package com.endava.endavastrength.repositories;


import org.springframework.data.jpa.repository.JpaRepository;

import com.endava.endavastrength.entities.SubCategory;
import java.util.List;
import java.util.Optional;


public interface SubCategoryRepository extends JpaRepository<SubCategory, Long>{
	
	List<SubCategory> findByCategory_CategoryId(long categoryId);
	
	Optional<SubCategory> findBySubCategoryName(String subCategoryName);
}
