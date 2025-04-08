package com.endava.endavastrength.service;

import java.util.List;

import com.endava.endavastrength.dtos.SubCategoryDto;
import com.endava.endavastrength.dtos.SubCategoryResponseDto;
import com.endava.endavastrength.entities.SubCategory;

public interface SubCategoryService {
	
	SubCategoryDto addSubCategory(SubCategoryDto subCategoryDto);
	
	List<SubCategoryDto> getAllSubCategories();
	
	void deleteSubCategoryById(long id);
	
	List<SubCategoryDto> getAllSubCategoriesByCategoryId(long id);
	
	SubCategory findSubCategoryById(long id);
	
	SubCategoryResponseDto getSubCategoryWithProducts(String subCategoryName);
}
