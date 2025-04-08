package com.endava.endavastrength.mapper;

import org.springframework.stereotype.Component;

import com.endava.endavastrength.dtos.PaymentDto;
import com.endava.endavastrength.entities.Payment;

@Component
public class PaymentMapper {
	
	public PaymentDto toPaymentDto(Payment payment) {
		if(payment!=null) {
			return new PaymentDto(
					payment.getPaymentId(),
					0,
					payment.getPaymentMethod(),
					payment.getPaymentAmount(),
					payment.getPaymentStatus());
		}
		else {
			return null;
		}
		
	}
}
