package com.endava.endavastrength.service;

import java.util.List;

import com.endava.endavastrength.dtos.SavedCardDto;


public interface SavedCardService {
	
	SavedCardDto saveCard(SavedCardDto savedCardDto);
	
	List<SavedCardDto> getAllSavedCards(long userId);
	
	SavedCardDto retreiveCardDetails(long savedCardId);
	
	void deleteSavedCard(long savedCardId);
}
