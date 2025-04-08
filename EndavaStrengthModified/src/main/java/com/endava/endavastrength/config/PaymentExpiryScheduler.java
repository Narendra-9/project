package com.endava.endavastrength.config;


import java.util.List;

import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import com.endava.endavastrength.service.OrderService;
import com.endava.endavastrength.service.PaymentSessionService;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;


/**
 * Scheduler to handle expired payment sessions.
 * This class checks for expired payment sessions every minute and cancels the related orders.
 * It also marks the payment sessions as expired in the database.
 */
@Slf4j
@Component
@RequiredArgsConstructor
public class PaymentExpiryScheduler {
	
    /**
     * Service responsible for managing payment sessions.
     */
	private final PaymentSessionService paymentSessionService;

    /**
     * Service responsible for managing orders.
     */
	private final OrderService orderService;
	
    /**
     * Scheduled task that checks for expired payment sessions.
     * 
     * This method runs every minute to check for expired payment sessions and
     * 1. Cancels the orders related to the expired sessions.
     * 2. Marks the payment sessions as expired.
     * 
     * @return void
     */
    @Transactional
	@Scheduled(fixedRate = 60000)
    public void checkExpiredPayments() {
    	
    	//Fetch expired payment session IDs
        List<Integer> expiredSessionIds = paymentSessionService.findExpiredSessionIds();

        // If no expired sessions are found, exit the method
        if (expiredSessionIds.isEmpty()) {
            return;
        }

        // Cancel orders related to the expired sessions
        orderService.cancelOrdersBySessionIds(expiredSessionIds);
        
        // Mark the expired payment sessions as expired
        int updatedCount = paymentSessionService.markSessionsAsExpired(expiredSessionIds);
        
        log.info("Canceled {} orders and expired {} payment sessions due to timeout", expiredSessionIds.size(), updatedCount);
    }
}
