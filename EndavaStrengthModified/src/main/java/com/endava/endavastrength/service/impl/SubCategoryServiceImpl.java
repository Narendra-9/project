package com.endava.endavastrength.service.impl;

import java.util.List;

import org.springframework.stereotype.Service;

import com.endava.endavastrength.dtos.SubCategoryDto;
import com.endava.endavastrength.dtos.SubCategoryResponseDto;
import com.endava.endavastrength.entities.Category;
import com.endava.endavastrength.entities.SubCategory;
import com.endava.endavastrength.enums.ErrorMessage;
import com.endava.endavastrength.exceptions.RecordNotFoundException;
import com.endava.endavastrength.mapper.ProductMapper;
import com.endava.endavastrength.mapper.SubCategoryMapper;
import com.endava.endavastrength.repositories.CategoryRepository;
import com.endava.endavastrength.repositories.SubCategoryRepository;
import com.endava.endavastrength.service.SubCategoryService;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class SubCategoryServiceImpl implements SubCategoryService{
	
	private final SubCategoryMapper subCategoryMapper;
	
	private final SubCategoryRepository subCategoryRepository;
	
	private final CategoryRepository categoryRepository;
	
	private final ProductMapper productMapper;
	
	@Override
	public SubCategoryDto addSubCategory(SubCategoryDto subCategoryDto) {
		SubCategory subCategory=subCategoryMapper.toSubCategory(subCategoryDto);
		Category category=categoryRepository.findById(subCategoryDto.getCategoryId())
				.orElseThrow(()->new RecordNotFoundException(ErrorMessage.SUB_CATEGORY_NOT_FOUND.getMessage()));
		subCategory.setCategory(category);
		return subCategoryMapper.toSubCategoryDto(subCategoryRepository.save(subCategory));
	}

	@Override
	public List<SubCategoryDto> getAllSubCategories() {
		return subCategoryRepository.findAll().stream().map(subCategoryMapper::toSubCategoryDto).toList();
	}

	@Override
	public void deleteSubCategoryById(long id) {
		subCategoryRepository.deleteById(id);
	}

	@Override
	public List<SubCategoryDto> getAllSubCategoriesByCategoryId(long id) {
		return subCategoryRepository.findByCategory_CategoryId(id).stream()
				.map(subCategoryMapper::toSubCategoryDto)
				.toList();
	}

	@Override
	public SubCategory findSubCategoryById(long id) {
		return subCategoryRepository.findById(id)
				.orElseThrow(()->new RecordNotFoundException(ErrorMessage.SUB_CATEGORY_NOT_FOUND.getMessage()));
	}

	@Override
	public SubCategoryResponseDto getSubCategoryWithProducts(String categoryName) {
		
		SubCategory subCategory=subCategoryRepository.findBySubCategoryName(categoryName).orElseThrow(()->new RecordNotFoundException(ErrorMessage.SUB_CATEGORY_NOT_FOUND.getMessage()));
		
		SubCategoryResponseDto subCategoryDto=subCategoryMapper.toSubCategoryResponseDto(subCategory);
		
		subCategoryDto.setListOfProducts(subCategory.getListOfProducts().stream().map(productMapper::toProductCardDisplayDto).toList());
		
		return subCategoryDto;
	}
	
	

}
