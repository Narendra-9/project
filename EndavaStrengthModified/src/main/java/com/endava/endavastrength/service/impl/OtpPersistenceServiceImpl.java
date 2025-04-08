package com.endava.endavastrength.service.impl;

import java.time.LocalDateTime;

import java.util.Optional;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.endava.endavastrength.entities.Otp;
import com.endava.endavastrength.repositories.OtpRepository;
import com.endava.endavastrength.service.OtpPersistenceService;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class OtpPersistenceServiceImpl implements OtpPersistenceService{
	
	private final OtpRepository otpRepository;

	@Override
	@Transactional
	public void saveOtp(String email, String otp) {
		Optional<Otp> existingOtpRecord=otpRepository.findByEmail(email);
		if(existingOtpRecord.isPresent()) {
			 Otp existingOtp=existingOtpRecord.get();
			 existingOtp.setOtpString(otp);
			 existingOtp.setCreatedAt(LocalDateTime.now());
			 existingOtp.setExpiresAt(LocalDateTime.now().plusMinutes(10));
			 otpRepository.save(existingOtp);
		}
		else {
			Otp otpEntity=Otp.builder().email(email)
					   .otpString(otp)
					   .createdAt(LocalDateTime.now())
					   .expiresAt(LocalDateTime.now().plusMinutes(10))
					   .build();
			otpRepository.save(otpEntity);
		}
	}

}
