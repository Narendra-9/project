package com.endava.endavastrength.service;

import java.util.List;

import com.endava.endavastrength.dtos.DeliveryLocationDto;
import com.endava.endavastrength.exceptions.DeliveryLocationNotFoundException;

public interface DeliveryLocationService {
	
	DeliveryLocationDto addDeliveyLocation(DeliveryLocationDto deliveryLocationDto );
	
	int getExpectedDelivery(String state) throws DeliveryLocationNotFoundException;
	
	List<DeliveryLocationDto> getAllDeliveryLocations();
	
	void deleteDeliveryLocation(long id);
}
