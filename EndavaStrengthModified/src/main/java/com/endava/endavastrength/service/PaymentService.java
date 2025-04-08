package com.endava.endavastrength.service;

import com.endava.endavastrength.dtos.PaymentDto;

public interface PaymentService {
	
	PaymentDto processPayment(PaymentDto paymentDto,boolean isSuccess);
}
