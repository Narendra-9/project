package com.endava.endavastrength.service;

import java.util.List;

import com.endava.endavastrength.entities.Orders;
import com.endava.endavastrength.entities.PaymentSession;

public interface PaymentSessionService {
	PaymentSession createPaymentSession(Orders order);
	
	PaymentSession findById(long id);
	
	PaymentSession findByOrderId(long orderId);
	
	List<Integer> findExpiredSessionIds();
	
	int markSessionsAsExpired(List<Integer> sessionIds);
}
