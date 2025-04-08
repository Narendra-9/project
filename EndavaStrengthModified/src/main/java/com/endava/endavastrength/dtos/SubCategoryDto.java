package com.endava.endavastrength.dtos;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class SubCategoryDto {
	
	private long subCategoryId;
	
	private long categoryId;
	
	private String subCategoryName;
	
	private String subCategoryDescription;


}
