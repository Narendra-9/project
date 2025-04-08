package com.endava.endavastrength.dtos;

import java.util.List;

public record OrdersDto(

		long orderId,

		long userId,

		long userAddressId,

		long orderTotal,

		long esCashUsed,

		List<OrderItemDto> listOfOrderItemDtos) {
}
