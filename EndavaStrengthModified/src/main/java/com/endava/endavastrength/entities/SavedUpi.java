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
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class SavedUpi {
	
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private long savedUpiId;
	
	@ManyToOne
	@JoinColumn(name = "user_id")
	private Users user;
	
	private String encryptedUpiId;
	
	private String hashedUpiId;
	
}
