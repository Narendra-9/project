package com.endava.endavastrength.service.impl;

import java.util.List;

import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import com.endava.endavastrength.dtos.CategoryResponseDto;
import com.endava.endavastrength.dtos.DisplayBannerDto;
import com.endava.endavastrength.dtos.HomePageDto;
import com.endava.endavastrength.dtos.ProductCardDisplayDto;
import com.endava.endavastrength.response.PagedResponse;
import com.endava.endavastrength.service.CategoryService;
import com.endava.endavastrength.service.DisplayBannerService;
import com.endava.endavastrength.service.HomeService;
import com.endava.endavastrength.service.ProductService;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class HomePageServiceImpl implements HomeService{
	
	private final CategoryService categoryService;
	
	private final ProductService productService;
	
	private final DisplayBannerService displayBannerService;
	
	@Override
	public HomePageDto getHomePageData() {
		
		List<CategoryResponseDto> listOfAllCategories=categoryService.findAllCategoriesWithoutSubCategories();
		Pageable pageable = PageRequest.of(0, 8);
		List<DisplayBannerDto> listOfDisplayBanners=displayBannerService.getAllValidBanners();
		PagedResponse<ProductCardDisplayDto> apparelProducts=productService.findProductsByCategoryId(8, pageable);
		PagedResponse<ProductCardDisplayDto> fitFoodProducts=productService.findProductsByCategoryId(5, pageable);
		PagedResponse<ProductCardDisplayDto> newlyLaunchedProducts=productService.findAllNewlyLaunchedProducts(pageable);
		PagedResponse<ProductCardDisplayDto> lowStockProducts=productService.getLowStockProucts(10, pageable);
		
		return new HomePageDto(listOfDisplayBanners,
				listOfAllCategories,
				apparelProducts,
				fitFoodProducts,
				newlyLaunchedProducts,
				lowStockProducts);
	}

}
