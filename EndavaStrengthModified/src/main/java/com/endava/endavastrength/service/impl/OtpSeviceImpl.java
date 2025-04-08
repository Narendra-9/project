package com.endava.endavastrength.service.impl;

import java.io.File;
import java.io.IOException;
import java.io.InputStream;
import java.nio.charset.StandardCharsets;
import java.security.SecureRandom;
import java.time.LocalDateTime;
import java.util.Map;
import java.util.Objects;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;

import com.endava.endavastrength.dtos.LoginRequestDto;
import com.endava.endavastrength.entities.Otp;
import com.endava.endavastrength.enums.ErrorMessage;
import com.endava.endavastrength.exceptions.RecordNotFoundException;
import com.endava.endavastrength.repositories.OtpRepository;
import com.endava.endavastrength.service.OtpPersistenceService;
import com.endava.endavastrength.service.OtpService;

import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Slf4j
@Service
@RequiredArgsConstructor
public class OtpSeviceImpl implements OtpService{
	
	private final OtpRepository otpRepository;
	
	private final JavaMailSender javaMailSender;
	
	private final OtpPersistenceService otpPersistenceService;
	
	private static final SecureRandom random = new SecureRandom();
	
    @Value("${logo.path}")
    private String logoPath;
	
	@Override
	public String generateOtp() {
		int otp = 100000 + random.nextInt(900000);
        return String.valueOf(otp);
	}

	@Override
	public boolean verifyOtp(LoginRequestDto loginRequestDto) throws RecordNotFoundException{
		Optional<Otp> otpRecord= otpRepository.findByEmail(loginRequestDto.email());
		
		if(otpRecord.isPresent()) {
			Otp otpEntity=otpRecord.get();
			if(otpEntity.getOtpString().equals(loginRequestDto.otp()) && otpEntity.getExpiresAt().isAfter(LocalDateTime.now())) {
				otpRepository.delete(otpEntity);
				return true;
			}
		}
		else {
			throw new RecordNotFoundException(ErrorMessage.OTP_RECORD_NOT_FOUND.getMessage());
		}
		return false;
	}

	@Override
	public void sendOtptoMail(String email) throws MessagingException {
		log.info("Sending OTP email to {}", email);
		long startTime = System.currentTimeMillis();
		
		String subject = "Your OTP for Email Verification";
		String otpString=generateOtp();
		otpPersistenceService.saveOtp(email,otpString);
		
        String emailContent = loadEmailTemplate("otp-template.html");
        if (emailContent == null) {
            log.error("OTP email template could not be loaded.");
            return;
        }
        
        emailContent = replacePlaceholders(emailContent, Map.of("otp", otpString));
        
        sendEmail(email,subject,emailContent);
        long endTime = System.currentTimeMillis()-startTime;
        log.info("OTP sent to {} in {} ms", email, endTime);
        
	}
	
    /**
     * Sends an email with the given subject and content.
     *
     * @param toEmail  The recipient's email address.
     * @param subject  The subject of the email.
     * @param content  The email content.
     * @throws MessagingException If an error occurs while sending the email.
     */
    private void sendEmail(String toEmail, String subject, String content) throws MessagingException {
        MimeMessage message = javaMailSender.createMimeMessage();
        MimeMessageHelper helper = new MimeMessageHelper(message, true);
        helper.setTo(toEmail);
        helper.setSubject(subject);
        helper.setText(content, true);
        helper.addInline("companyLogo", new File(logoPath));
        javaMailSender.send(message);
        log.info("{} email sent to {}", subject, toEmail);
        
    }
	
	
    /**
     * Loads the email template from the resources folder.
     *
     * @param fileName The name of the email template file.
     * @return The email template content as a string, or null if an error occurs.
     */
    private String loadEmailTemplate(String fileName) {
        try (InputStream inputStream = Objects.requireNonNull(getClass().getResourceAsStream("/templates/" + fileName))) {
            return new String(inputStream.readAllBytes(), StandardCharsets.UTF_8);
        } catch (IOException | NullPointerException e) {
            log.error("Error loading email template: {}", fileName, e);
            return null;
        }
    }
    
    /**
     * Replaces placeholders in the email template with actual values.
     * Placeholders in the format ${key} are replaced with corresponding values from the provided map.
     *
     * @param template The email template containing placeholders.
     * @param values   The key-value pairs to replace placeholders.
     * @return The processed email content with replaced values.
     */
    private String replacePlaceholders(String template, Map<String, String> values) {
        for (Map.Entry<String, String> entry : values.entrySet()) {
            template = template.replace("${" + entry.getKey() + "}", entry.getValue());
        }
        return template;
    }

	@Override
	public int deleteByExpiresAtBefore(LocalDateTime now) {
		return otpRepository.deleteByExpiresAtBefore(now);
	}

}
