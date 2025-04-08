package com.endava.endavastrength.dtos;

import com.endava.endavastrength.enums.PaymentStatus;

public record PaymentDto(

		long paymentId,

		long orderId,

		String paymentMethod,

		long paymentAmount,

		PaymentStatus paymentStatus
) {}
