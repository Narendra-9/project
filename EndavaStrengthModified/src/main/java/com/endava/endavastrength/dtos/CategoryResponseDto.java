package com.endava.endavastrength.dtos;

import java.util.List;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Builder
@NoArgsConstructor
@AllArgsConstructor
@Data
public class CategoryResponseDto {

	private long categoryId;

	private String categoryName;

	private String categoryImgUrl;

	private String categoryDescription;

	private String categoryDisplayImgUrl;

	private List<SubCategoryResponseDto> listOfSubCategoryResponseDtos;

}
