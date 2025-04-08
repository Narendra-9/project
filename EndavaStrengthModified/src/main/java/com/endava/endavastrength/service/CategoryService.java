package com.endava.endavastrength.service;

import java.util.List;

import com.endava.endavastrength.dtos.CategoryDto;
import com.endava.endavastrength.dtos.CategoryResponseDto;
import com.endava.endavastrength.entities.Category;

public interface CategoryService {
	
	CategoryResponseDto addCategory(CategoryDto categoryDto);
	
	List<CategoryResponseDto> findAllCategoriesWithoutSubCategories();
	
	List<CategoryResponseDto> findAllCategoriesWithSubCategories();
	
	void deleteByCategoryId(long id);
	
	void discontinueCategory(long id);
	
	Category findCategoryById(long id);
	
	boolean categoryExists(String categoryName);
	
	CategoryResponseDto findByCategoryName(String categoryName);
}
