package com.endava.endavastrength.dtos;

public record DeliveryLocationDto (
		long deliveryLocationId,
		String deliveryLocation,
		int expectedDeliveryDays) {}
