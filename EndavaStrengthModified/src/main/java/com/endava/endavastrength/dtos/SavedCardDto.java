package com.endava.endavastrength.dtos;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class SavedCardDto {
	
	private long savedCardId;
	private long userId;
	private String cardHolderName;
	private String cardType;
	private String cardNumber;
	private String expiry;
	private String hashedCard;
}
