package com.endava.endavastrength.dtos;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class SavedUpiDto {
	
	private long savedUpiId;
	
	private long userId;
	
	private String upiId;
	
	private String maskedUpiId;
}
