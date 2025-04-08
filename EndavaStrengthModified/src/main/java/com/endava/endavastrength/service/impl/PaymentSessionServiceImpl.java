package com.endava.endavastrength.service.impl;

import java.time.LocalDateTime;
import java.util.List;

import org.springframework.stereotype.Service;

import com.endava.endavastrength.entities.Orders;
import com.endava.endavastrength.entities.PaymentSession;
import com.endava.endavastrength.enums.PaymentSessionStatus;
import com.endava.endavastrength.exceptions.RecordNotFoundException;
import com.endava.endavastrength.repositories.PaymentSessionRepository;
import com.endava.endavastrength.service.PaymentSessionService;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class PaymentSessionServiceImpl implements PaymentSessionService{
	
	
	private final PaymentSessionRepository paymentSessionRepository;

	@Override
	public PaymentSession createPaymentSession(Orders order) {
		PaymentSession paymentSession=new PaymentSession();
		paymentSession.setOrder(order);
		paymentSession.setPaymentSessionStatus(PaymentSessionStatus.PENDING);
		paymentSession.setExpiresAt(LocalDateTime.now().plusMinutes(5));
		return paymentSessionRepository.save(paymentSession);
	}

	@Override
	public PaymentSession findById(long id) {
		return paymentSessionRepository.findById(id)
				.orElseThrow(()->new RecordNotFoundException("Payment Session Not Found"));
	}

	@Override
	public PaymentSession findByOrderId(long orderId) {
		return paymentSessionRepository.findByOrder_OrderId(orderId)
				.orElseThrow(()->new RecordNotFoundException("Payment Session Not Found"));
	}

	@Override
	public List<Integer> findExpiredSessionIds() {
		
		return paymentSessionRepository.findExpiredSessionIds();
	}

	@Override
	public int markSessionsAsExpired(List<Integer> sessionIds) {
		return paymentSessionRepository.markSessionsAsExpired(sessionIds);
	}

}
