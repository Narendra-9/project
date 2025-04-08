package com.endava.endavastrength.controllers;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.endava.endavastrength.dtos.CategoryDto;
import com.endava.endavastrength.dtos.CategoryResponseDto;
import com.endava.endavastrength.entities.Category;
import com.endava.endavastrength.entities.SubCategory;
import com.endava.endavastrength.enums.StatusMessage;
import com.endava.endavastrength.response.ApiGenericResponse;
import com.endava.endavastrength.response.ApiGenericResponseUtil;
import com.endava.endavastrength.service.CategoryService;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/category")
@RequiredArgsConstructor
public class CategoryController {
	
	private final CategoryService categoryService;
	
	@PostMapping(consumes = {"application/json"},produces = {"application/json"})
	public ResponseEntity<ApiGenericResponse> addCategory(@RequestBody CategoryDto categoryDto) {
		CategoryResponseDto addedCategory= categoryService.addCategory(categoryDto);
		
		return ApiGenericResponseUtil.createSuccessResponse(addedCategory,
				StatusMessage.CATEGORY_ADDED.getMessage(),
				HttpStatus.OK);
	}
	
	@GetMapping
	public ResponseEntity<ApiGenericResponse> findAllCategoriesWithSubCategories(){
		List<CategoryResponseDto> listOfAllCategories=categoryService.findAllCategoriesWithSubCategories();		
		return ApiGenericResponseUtil.createSuccessResponse(listOfAllCategories,
															StatusMessage.CATGEORIES_WITH_SUBCATEGORIES.getMessage(),
															HttpStatus.OK);
	}
	
	@GetMapping(path = "/without-subcategories")
	public ResponseEntity<ApiGenericResponse> findAllCategoriesWithOutSubCategories(){
		List<CategoryResponseDto> listOfAllCategories=categoryService.findAllCategoriesWithoutSubCategories();
		
		return ApiGenericResponseUtil.createSuccessResponse(listOfAllCategories,
				StatusMessage.CATGEORIES_WITHOUT_SUBCATEGORIES.getMessage(),
				HttpStatus.OK);
	}
	
	@GetMapping(path = "categoryName/{categoryName}")
	public ResponseEntity<ApiGenericResponse> findACategoryWithOutSubCategories(@PathVariable String categoryName){
		CategoryResponseDto category=categoryService.findByCategoryName(categoryName);
		
		return ApiGenericResponseUtil.createSuccessResponse(category,
				StatusMessage.CATGEORY_WITHOUT_SUBCATEGORIES.getMessage(),
				HttpStatus.OK);
	}
	
	@DeleteMapping(path = {"deleteById/{id}"})
	public ResponseEntity<String> deleteCategoryById(@PathVariable int id ) {
		categoryService.deleteByCategoryId(id);
		return ResponseEntity.ok(StatusMessage.CATEGORY_DELETED.getMessage());
	}
	
	@GetMapping(path = {"byId/{id}"})
	public List<SubCategory> findSubCategoriesByCategoryId(@PathVariable int id){
		Category category=categoryService.findCategoryById(id);
		return category.getListOfSubCategories();
	}
}
