package com.endava.endavastrength.mapper;

import org.springframework.stereotype.Component;

import com.endava.endavastrength.dtos.SubCategoryDto;
import com.endava.endavastrength.dtos.SubCategoryResponseDto;
import com.endava.endavastrength.entities.SubCategory;

import lombok.RequiredArgsConstructor;

@Component
@RequiredArgsConstructor
public class SubCategoryMapper {
	
	public SubCategoryDto toSubCategoryDto(SubCategory subCategory) {
		return SubCategoryDto.builder()
							 .subCategoryId(subCategory.getSubCategoryId())
							 .subCategoryName(subCategory.getSubCategoryName())
							 .subCategoryDescription(subCategory.getSubCategoryDescription())
							 .categoryId(subCategory.getCategory().getCategoryId())
							 .build();
	}
	
	public SubCategory toSubCategory(SubCategoryDto subCategoryDto) {
		return SubCategory.builder()
						  .subCategoryName(subCategoryDto.getSubCategoryName())
						  .subCategoryDescription(subCategoryDto.getSubCategoryDescription())
						  .build();
	}
	
	public SubCategoryResponseDto toSubCategoryResponseDto(SubCategory subCategory) {
		return SubCategoryResponseDto.builder()
				 .subCategoryId(subCategory.getSubCategoryId())
				 .subCategoryName(subCategory.getSubCategoryName())
				 .subCategoryDescription(subCategory.getSubCategoryDescription())
				 .build();
	}
	
}
