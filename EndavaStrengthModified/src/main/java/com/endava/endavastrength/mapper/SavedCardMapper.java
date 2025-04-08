package com.endava.endavastrength.mapper;

import org.springframework.stereotype.Component;
import com.endava.endavastrength.dtos.SavedCardDto;
import com.endava.endavastrength.entities.SavedCard;
import lombok.RequiredArgsConstructor;



@Component
@RequiredArgsConstructor
public class SavedCardMapper {
	
	public SavedCard toSavedCard(SavedCardDto savedCardDto) {
			return SavedCard.builder()
							.cardHolderName(savedCardDto.getCardHolderName())
							.cardType(savedCardDto.getCardType())
							.maskedCardNumber(getMaskedCardNumber(savedCardDto.getCardNumber()))
							.build();
	}
	
	

	public SavedCardDto toSavedCardDtoForDisplay(SavedCard savedCard) {
			return SavedCardDto.builder()
							.savedCardId(savedCard.getSavedCardId())
							.cardNumber(savedCard.getMaskedCardNumber())
							.cardType(savedCard.getCardType())
							.build();
						
	}
	
	

	public SavedCardDto toSavedCardDtoToRetrieve(SavedCard savedCard) {
			return SavedCardDto.builder()
							   .cardHolderName(savedCard.getCardHolderName())
							   .userId(savedCard.getUser().getUserId())
							   .cardType(savedCard.getCardType())
							   .build();

	}
	
	
	private String getMaskedCardNumber(String cardNumber) {
		String lastFourDigits=cardNumber.substring(cardNumber.length()-4);
		return "**** **** **** "+lastFourDigits;
	}
}
