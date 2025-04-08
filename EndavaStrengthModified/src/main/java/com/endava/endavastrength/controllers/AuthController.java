package com.endava.endavastrength.controllers;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.endava.endavastrength.dtos.LoginRequestDto;
import com.endava.endavastrength.dtos.UserDto;
import com.endava.endavastrength.enums.ApiPaths;
import com.endava.endavastrength.enums.StatusMessage;
import com.endava.endavastrength.response.ApiGenericResponse;
import com.endava.endavastrength.response.ApiGenericResponseUtil;
import com.endava.endavastrength.service.AuthService;

import jakarta.mail.MessagingException;
import lombok.RequiredArgsConstructor;

/**
 * Controller for handling authentication-related requests like OTP generation
 * and login.
 */
@RestController
@RequestMapping(ApiPaths.AUTH)
@RequiredArgsConstructor
public class AuthController {
	
	
	/**
	 * Service used for authentication tasks like login and OTP verification.
	 */
	private final AuthService authService;
	
	/**
	 * Endpoint to send an OTP to the user's email.
	 * 
	 * @param email The email address to send the OTP to.
	 * @return A message indicating the OTP was sent successfully.
	 * @throws MessagingException if there is an issue sending the email.
	 */
	@PostMapping(path = ApiPaths.SEND_OTP,consumes = "application/json",produces = "application/json")
	public ResponseEntity<String> sendOtpToMail(@RequestParam String email) throws MessagingException {
		authService.sendOtp(email);
		return ResponseEntity.ok(StatusMessage.OTP_SENT_SUCCESSFULLY.getMessage());
	}
	
	
	/**
	 * Endpoint to verify the OTP and log the user in.
	 * 
	 * @param loginRequestDto The login request containing Email and OTP.
	 * @return A response containing login details if successful.
	 */
	@PostMapping(path = ApiPaths.VERIFY_OTP,consumes = "application/json",produces = "application/json")
	public ResponseEntity<ApiGenericResponse> validateOtp(@RequestBody LoginRequestDto loginRequestDto){
		
		UserDto loginResponseDto=authService.login(loginRequestDto);
		
		// Using the utility class to create the success response
		return ApiGenericResponseUtil.createSuccessResponse(loginResponseDto, 
								StatusMessage.LOGIN_SUCCESSFULL.getMessage(),
								HttpStatus.CREATED);
	}
}
