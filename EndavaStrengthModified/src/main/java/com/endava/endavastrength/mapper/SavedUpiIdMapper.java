package com.endava.endavastrength.mapper;

import org.springframework.stereotype.Component;

import com.endava.endavastrength.dtos.SavedUpiDto;
import com.endava.endavastrength.entities.SavedUpi;

@Component
public class SavedUpiIdMapper {
	
	
	public SavedUpiDto toSavedUpiDtoDisplay(SavedUpi savedUpi){
		return SavedUpiDto.builder()
						  .savedUpiId(savedUpi.getSavedUpiId())
						  .userId(savedUpi.getUser().getUserId())
						  .build();
	}
	
	public SavedUpiDto toSavedUpiDtoRetreive(SavedUpi savedUpi){
		return SavedUpiDto.builder()
						  .savedUpiId(savedUpi.getSavedUpiId())
						  .userId(savedUpi.getUser().getUserId())
						  .build();
	}
	
}
