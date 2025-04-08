package com.endava.endavastrength.mapper;

import org.springframework.stereotype.Component;

import com.endava.endavastrength.dtos.PaymentSessionDto;
import com.endava.endavastrength.entities.PaymentSession;

@Component
public class PaymentSessionMapper {
	
	public PaymentSessionDto toPaymentSessionDto(PaymentSession paymentSession) {
		return new PaymentSessionDto(paymentSession.getPaymentSessionId(),
				paymentSession.getPaymentSessionStatus(),
				paymentSession.getExpiresAt());
	}
}
