package com.endava.endavastrength.service.impl;

import java.util.List;

import java.util.Optional;

import org.springframework.stereotype.Service;

import com.endava.endavastrength.dtos.CategoryDto;
import com.endava.endavastrength.dtos.CategoryResponseDto;
import com.endava.endavastrength.entities.Category;
import com.endava.endavastrength.enums.ErrorMessage;
import com.endava.endavastrength.exceptions.RecordNotFoundException;
import com.endava.endavastrength.mapper.CategoryMapper;
import com.endava.endavastrength.repositories.CategoryRepository;
import com.endava.endavastrength.service.CategoryService;

import lombok.RequiredArgsConstructor;

/**
 * Implementation of CategoryService that provides the business logic for managing categories.
 */
@Service
@RequiredArgsConstructor
public class CategoryServiceImpl implements CategoryService{
	
	private final CategoryRepository categoryRepository;
	
	private final CategoryMapper categoryMapper;

    /**
     * Adds a new category to the repository.
     * 
     * @param categoryDto the category data transfer object containing category details.
     * @return CategoryDtoWithoutSubCategories the created category DTO without subcategories.
     */
	@Override
	public CategoryResponseDto addCategory(CategoryDto categoryDto) {
		Category category=categoryMapper.toCategory(categoryDto);
		return categoryMapper.toCategoryDtoWithoutSubCategories(categoryRepository.save(category));
	}

    /**
     * Deletes a category by its ID.
     * 
     * @param id the ID of the category to be deleted.
     */
	@Override
	public void deleteByCategoryId(long id) {
		categoryRepository.deleteById(id);
		
	}

    /**
     * Finds a category by its ID.
     * 
     * @param id the ID of the category to find.
     * @return Category the category found.
     * @throws RecordNotFoundException if no category is found with the given ID.
     */
	@Override
	public Category findCategoryById(long id) {
		return categoryRepository.findById(id).orElseThrow(()->new RecordNotFoundException(ErrorMessage.CATEGORY_NOT_FOUND.getMessage()));
	}

    /**
     * Retrieves all categories without their subcategories.
     * 
     * @return a list of CategoryDtoWithoutSubCategories representing the categories without subcategories.
     */
	@Override
	public List<CategoryResponseDto> findAllCategoriesWithoutSubCategories() {
		List<Category> listOfCategories=categoryRepository.findAll();
		return listOfCategories.stream()
				.map(categoryMapper::toCategoryDtoWithoutSubCategories)
				.toList();
	}

    /**
     * Retrieves all categories along with their subcategories.
     * 
     * @return a list of {@link CategoryDtoWithSubCategories} representing the categories with their subcategories.
     */
	@Override
	public List<CategoryResponseDto> findAllCategoriesWithSubCategories() {
		List<Category> listOfCategories=categoryRepository.findAll();																		
		return listOfCategories.stream()
				.map(categoryMapper::toCategoryDtoWithSubCategories)
				.toList();
	}

    /**
     * Checks if a category with the given name exists in the repository.
     * 
     * @param categoryName the name of the category to check for existence.
     * @return true if the category exists, otherwise false.
     */
	@Override
	public boolean categoryExists(String categoryName) {
		return categoryRepository.existsByCategoryNameIgnoreCase(categoryName);
	}

    /**
     * Finds a category by its name and returns the category data without subcategories.
     * 
     * @param categoryName the name of the category to find.
     * @return CategoryDtoWithoutSubCategories the category data without subcategories.
     * @throws RecordNotFoundException if no category is found with the given name.
     */
	@Override
	public CategoryResponseDto findByCategoryName(String categoryName) {
		Optional<Category> categoryRecord=categoryRepository.findByCategoryNameIgnoreCase(categoryName);
		if(categoryRecord.isPresent()) {
			Category category=categoryRecord.get();
			CategoryResponseDto categoryDtoWithoutSubCategories=categoryMapper.toCategoryDtoWithoutSubCategories(category);
			categoryDtoWithoutSubCategories.setCategoryDescription(category.getCategoryDescription());
			return categoryDtoWithoutSubCategories;
		}
		throw new RecordNotFoundException(ErrorMessage.CATEGORY_NOT_FOUND.getMessage());
	}

	@Override
	public void discontinueCategory(long id) {
//		will do it later.
		
	}

}
