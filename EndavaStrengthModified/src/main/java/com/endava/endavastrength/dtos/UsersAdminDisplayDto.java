package com.endava.endavastrength.dtos;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class UsersAdminDisplayDto {

	private long userId;
	
	private String userName;
	
	private String userEmail;
	
	private String gender;
	
	private String phoneNumber;
	
	private long orderedAmount;
	
	private long noOfOrdersPlaced;
	
	private boolean isLoggedIn;

	private boolean isActive;
	
	private long esCashPoints;
	
	private boolean isPremiumActive;
	
}
