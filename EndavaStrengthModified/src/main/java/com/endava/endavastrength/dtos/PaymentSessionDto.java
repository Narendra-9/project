package com.endava.endavastrength.dtos;

import java.time.LocalDateTime;

import com.endava.endavastrength.enums.PaymentSessionStatus;

public record PaymentSessionDto(

		long paymentSessionId,

		PaymentSessionStatus paymentSessionStatus,

		LocalDateTime expiresAt) {
}
