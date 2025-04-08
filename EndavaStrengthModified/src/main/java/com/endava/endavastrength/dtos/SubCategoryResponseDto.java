package com.endava.endavastrength.dtos;

import java.util.List;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@Builder
@NoArgsConstructor
public class SubCategoryResponseDto {
	
	private long subCategoryId;
	
	private String subCategoryName;
	
	private String subCategoryDescription;
	
	private List<ProductCardDisplayDto> listOfProducts;
}
