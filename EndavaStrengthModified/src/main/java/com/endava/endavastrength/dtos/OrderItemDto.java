package com.endava.endavastrength.dtos;

public record OrderItemDto (
	long orderItemsId,
	long productId,
	long orderId,
	int quantity
) {}
