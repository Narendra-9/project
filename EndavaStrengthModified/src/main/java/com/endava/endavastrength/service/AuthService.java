package com.endava.endavastrength.service;

import com.endava.endavastrength.dtos.LoginRequestDto;
import com.endava.endavastrength.dtos.UserDto;

import jakarta.mail.MessagingException;

public interface AuthService {
	
	UserDto login(LoginRequestDto loginRequestDto);
	
	void sendOtp(String email) throws MessagingException;
}
