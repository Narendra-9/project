package com.endava.endavastrength.config;

import java.time.LocalDateTime;
import org.springframework.context.annotation.Configuration;
import org.springframework.scheduling.annotation.EnableScheduling;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.transaction.annotation.Transactional;
import com.endava.endavastrength.service.OtpService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

/**
 * This class is for cleaning up expired OTPs from the repository at regular intervals.
 * 
 * The cleanup operation is scheduled to run at a fixed rate every 10 minutes (600,000 milliseconds).
 * The method `cleanExpiredOtps` will delete OTPs whose expiration time has passed.
 * 
 * It uses `@Scheduled` annotation to run the cleanup job at the defined interval, and
 * `@Transactional` annotation to ensure the operation is performed within a transaction.
 */
@Slf4j
@Configuration
@EnableScheduling
@RequiredArgsConstructor
public class OTPExpirationScheduler {
	
    /**
     * Service responsible for OTP operations.
     * Injected via constructor injection.
     */
	private final OtpService otpService;
	
	
    /**
     * Scheduled task that deletes expired OTPs.
     * 
     * This method runs every 10 minutes and deletes OTPs that have expired (based on the expiration timestamp).
     *
     * @return void
     */
	@Transactional
	@Scheduled(fixedRate = 600000)
	public void cleanExpiredOtps() {
		
		LocalDateTime now=LocalDateTime.now();
		
		// Delete expired OTPs
		int deletedCount=otpService.deleteByExpiresAtBefore(now);
		
		log.info("Deleted {} expired OTPs at {}", deletedCount, now);
	}
}
