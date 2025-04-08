package com.endava.endavastrength.service;

import java.util.List;

import com.endava.endavastrength.dtos.SavedUpiDto;

public interface SavedUpiService {
	
	SavedUpiDto saveUpi(SavedUpiDto savedUpiDto);
	
	List<SavedUpiDto> getAllSavedUpis(long userId);
	
	void deleteSavedUpi(long savedUpiId);
	
	SavedUpiDto retreiveUpiDetails(long savedUpiId);
}
