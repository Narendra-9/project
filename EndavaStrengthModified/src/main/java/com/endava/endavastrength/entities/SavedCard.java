package com.endava.endavastrength.entities;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Data
public class SavedCard {
	
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private long savedCardId;
	
	@ManyToOne
	@JoinColumn(name = "user_id")
	private Users user;
	
	private String maskedCardNumber;
	
	private String cardHolderName;
	
	private String cardType;
	
	private String encryptedCardNumber;
	
	private String encryptedExpiry;
	
	private String hashedCard;
}
