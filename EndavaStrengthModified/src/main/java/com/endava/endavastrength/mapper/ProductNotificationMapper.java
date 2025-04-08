package com.endava.endavastrength.mapper;

import org.springframework.stereotype.Component;

import com.endava.endavastrength.dtos.ProductNotificationDto;
import com.endava.endavastrength.entities.ProductNotification;

@Component
public class ProductNotificationMapper {
	
	public ProductNotificationDto toProductNotificationDto(ProductNotification productNotification) {

		return new ProductNotificationDto(
				productNotification.getNotificationId(),
				productNotification.getProduct().getProductId(),
				productNotification.getUser().getUserId());
	}
}
