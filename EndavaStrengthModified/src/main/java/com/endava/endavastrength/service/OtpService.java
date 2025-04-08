package com.endava.endavastrength.service;
import java.time.LocalDateTime;

import com.endava.endavastrength.dtos.LoginRequestDto;
import com.endava.endavastrength.exceptions.RecordNotFoundException;

import jakarta.mail.MessagingException;

public interface OtpService {
	
	String generateOtp();
	
	boolean verifyOtp(LoginRequestDto loginRequestDto) throws RecordNotFoundException;
	
	void sendOtptoMail(String email) throws MessagingException;
		
	int deleteByExpiresAtBefore(LocalDateTime now);
}
