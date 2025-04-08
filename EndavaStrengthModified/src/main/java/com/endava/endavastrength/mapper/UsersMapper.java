package com.endava.endavastrength.mapper;

import org.springframework.stereotype.Component;

import com.endava.endavastrength.dtos.UserDto;
import com.endava.endavastrength.dtos.UsersAdminDisplayDto;
import com.endava.endavastrength.entities.Users;

import lombok.RequiredArgsConstructor;

@Component
@RequiredArgsConstructor
public class UsersMapper {
	
	public UserDto toLoginResponseDto(Users user) {
		return UserDto.builder()
				.userId(user.getUserId())
				.userName(user.getUserName())
				.userEmail(user.getUserEmail())
				.role(user.getRole())
				.esCashPoints(user.getEsCashPoints())
				.isPremiumActive(user.isPremiumActive())
				.build();
	}
	
	
	public UsersAdminDisplayDto toUsersAdminDisplayDto(Users user) {
		return UsersAdminDisplayDto.builder()
								   .userId(user.getUserId())
								   .userName(user.getUserName())
								   .userEmail(user.getUserEmail())
								   .esCashPoints(user.getEsCashPoints())
								   .gender(user.getGender())
								   .isActive(user.isActive())
								   .isLoggedIn(user.isLoggedIn())
								   .isPremiumActive(user.isPremiumActive())
								   .phoneNumber(user.getPhoneNumber())
								   .build();
	}
}
