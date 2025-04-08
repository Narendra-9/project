package com.endava.endavastrength.mapper;


import org.springframework.stereotype.Component;


import com.endava.endavastrength.dtos.CategoryDto;
import com.endava.endavastrength.dtos.CategoryResponseDto;
import com.endava.endavastrength.dtos.SubCategoryResponseDto;
import com.endava.endavastrength.entities.Category;

import lombok.RequiredArgsConstructor;

@Component
@RequiredArgsConstructor
public class CategoryMapper {
	
	
	public Category toCategory(CategoryDto categoryDto) {
		return Category.builder()
					   .categoryName(categoryDto.categoryName())
					   .categoryDisplayImgUrl(categoryDto.categoryDisplayImgUrl())
					   .categoryImgUrl(categoryDto.categoryImgUrl())
					   .categoryDescription(categoryDto.categoryDescription())
					   .build();
	}
	
	public CategoryResponseDto toCategoryDtoWithoutSubCategories(Category category) {
		return CategoryResponseDto.builder()
								  .categoryId(category.getCategoryId())
								  .categoryName(category.getCategoryName())
								  .categoryImgUrl(category.getCategoryImgUrl())
								  .build();
	}
	
	public CategoryResponseDto toCategoryDtoWithSubCategories(Category category) {
		
		return CategoryResponseDto.builder()
				  .categoryId(category.getCategoryId())
				  .categoryName(category.getCategoryName())
				  .categoryImgUrl(category.getCategoryImgUrl())
				  .categoryDisplayImgUrl(category.getCategoryDisplayImgUrl())
				  .listOfSubCategoryResponseDtos(category.getListOfSubCategories().stream()
							.map(i->new SubCategoryResponseDto(i.getSubCategoryId(),i.getSubCategoryName(),null,null))
							.toList())
				  .build();
	}
}
