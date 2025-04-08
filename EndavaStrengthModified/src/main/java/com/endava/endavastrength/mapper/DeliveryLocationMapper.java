package com.endava.endavastrength.mapper;

import org.springframework.stereotype.Component;

import com.endava.endavastrength.dtos.DeliveryLocationDto;
import com.endava.endavastrength.entities.DeliveryLocation;

@Component
public class DeliveryLocationMapper {
	
	public DeliveryLocation toDeliveryLocation(DeliveryLocationDto deliveryLocationDto) {
		return DeliveryLocation.builder()
							   .deliveryState(deliveryLocationDto.deliveryLocation())
							   .expectedDeliverydays(deliveryLocationDto.expectedDeliveryDays())
							   .build();
	}
	
	public DeliveryLocationDto toDeliveryLocationDto(DeliveryLocation deliveryLocation) {

		return new DeliveryLocationDto(
				deliveryLocation.getDeliveryLocationId(),
				deliveryLocation.getDeliveryState(),
				deliveryLocation.getExpectedDeliverydays());
	}
}
