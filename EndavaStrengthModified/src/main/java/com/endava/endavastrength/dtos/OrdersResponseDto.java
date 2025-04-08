package com.endava.endavastrength.dtos;

import java.time.LocalDateTime;
import java.util.List;

import com.endava.endavastrength.enums.OrderStatus;

public record OrdersResponseDto(

		long orderId,

		List<OrderItemResponseDto> listOfOrderItems,

		UserAddressDto userAddress,

		OrderStatus orderStatus,

		long totalOrderAmount,

		PaymentDto payment,

		PaymentSessionDto paymentSession,

		LocalDateTime createdAt) {
}
