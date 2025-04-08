package com.endava.endavastrength.dtos;

import java.util.List;

import com.endava.endavastrength.response.PagedResponse;

public record HomePageDto(

		List<DisplayBannerDto> displayBannerDtos,

		List<CategoryResponseDto> categoryDtoWithoutSubCategories,

		PagedResponse<ProductCardDisplayDto> apparelRangeProducts,

		PagedResponse<ProductCardDisplayDto> fitFoodProducts,

		PagedResponse<ProductCardDisplayDto> newlyLaunchedProducts,

		PagedResponse<ProductCardDisplayDto> lowStockProducts) {
}
