package com.endava.endavastrength.dtos;

import com.endava.endavastrength.enums.Role;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class UserDto {

	private long userId;

	private String userName;

	private String userEmail;

	private String gender;

	private String phoneNumber;

	private Role role;

	private boolean isLoggedIn;

	private boolean isPremiumActive;

	private long esCashPoints;
}
