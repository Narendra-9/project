package com.endava.endavastrength.service.impl;

import org.springframework.stereotype.Service;

import com.endava.endavastrength.dtos.LoginRequestDto;
import com.endava.endavastrength.dtos.UserDto;
import com.endava.endavastrength.entities.Users;
import com.endava.endavastrength.enums.ErrorMessage;
import com.endava.endavastrength.exceptions.EmailSendingException;
import com.endava.endavastrength.exceptions.InvalidOTPException;
import com.endava.endavastrength.mapper.UsersMapper;
import com.endava.endavastrength.service.AuthService;
import com.endava.endavastrength.service.OtpService;
import com.endava.endavastrength.service.UsersService;

import jakarta.mail.MessagingException;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

/**
 * Service implementation for authentication-related operations.
 */
@Slf4j
@Service
@RequiredArgsConstructor
public class AuthServiceImpl implements AuthService{
	
    /**
     * Service for handling OTP-related operations.
     */
	private final OtpService otpService;
	
    /**
     * Service for handling user-related operations.
     */
	private final UsersService usersService;
	
	
	private final UsersMapper usersMapper;
	
	
    /**
     * Logs in a user by verifying the OTP.
     *
     * @param loginRequestDto The DTO containing login details (email, OTP).
     * @return LoginResponseDto containing user details
     * @throws InvalidOTPException if the OTP is incorrect.
     */
	@Override
	public UserDto login(LoginRequestDto loginRequestDto) {
		
		// Verifies the OTP for login
		if(otpService.verifyOtp(loginRequestDto)) {
			Users user=usersService.createOrRetrieveUser(loginRequestDto.email());
			return usersMapper.toLoginResponseDto(user);
		}
		else {
			throw new InvalidOTPException(ErrorMessage.INVALID_OTP.getMessage());
		}
	}

    /**
     * Sends a one-time password (OTP) to the user's email.
     *
     * @param email The email address to which the OTP will be sent.
     * @throws MessagingException if there is an error while sending the email.
     */
	@Override
	public void sendOtp(String email) {
		try {
			otpService.sendOtptoMail(email);
		} catch (MessagingException e ) {
			throw new EmailSendingException(ErrorMessage.EMAIL_ERROR.getMessage());
		}
	}

}
