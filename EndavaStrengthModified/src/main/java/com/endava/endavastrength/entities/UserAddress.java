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
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class UserAddress {
	
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private long userAddressId;
	
	private String fullName;
	
	private String email;
	
	private String mobileNo;
	
	private String address;
	
	private String locality;
	
	private String pincode;
	
	private String city;
	
	private String state;
	
	private boolean isDefault;
	
	private boolean isActive;
	
	@ManyToOne
	@JoinColumn(name = "user_id")
	private Users user;
	
}
