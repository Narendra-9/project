package com.endava.endavastrength.entities;

import java.time.LocalDate;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class DisplayBanner {
	
	
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private long bannerId;
	
	@Column(nullable = false, unique = true)
	private String bannerImgUrl;
	
	private LocalDate validity;
	
	private String takeToUrl;
}
