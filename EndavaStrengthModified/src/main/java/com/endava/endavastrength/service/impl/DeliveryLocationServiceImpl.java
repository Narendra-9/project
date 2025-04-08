package com.endava.endavastrength.service.impl;

import java.util.List;
import java.util.Optional;

import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.stereotype.Service;

import com.endava.endavastrength.dtos.DeliveryLocationDto;
import com.endava.endavastrength.entities.DeliveryLocation;
import com.endava.endavastrength.enums.ErrorMessage;
import com.endava.endavastrength.exceptions.DeliveryLocationNotFoundException;
import com.endava.endavastrength.exceptions.RecordAlreadyExistsException;
import com.endava.endavastrength.exceptions.RecordNotFoundException;
import com.endava.endavastrength.mapper.DeliveryLocationMapper;
import com.endava.endavastrength.repositories.DeliveryLocationRepository;
import com.endava.endavastrength.service.DeliveryLocationService;

import lombok.RequiredArgsConstructor;


/**
 * Service implementation for managing delivery locations.
 */
@Service
@RequiredArgsConstructor
public class DeliveryLocationServiceImpl implements DeliveryLocationService{
	
	
    /**
     * Repository for performing CRUD operations on delivery locations.
     */
	private final DeliveryLocationRepository deliveryLocationRepository;
	
    /**
     * Mapper for converting between DeliveryLocation and DeliveryLocationDto.
     */
	private final DeliveryLocationMapper deliveryLocationMapper;
	
	
    /**
     * Adds a new delivery location to the system.
     *
     * @param deliveryLocationDto The DTO containing delivery location details.
     * @return The saved delivery location DTO.
     */
	@Override
	public DeliveryLocationDto addDeliveyLocation(DeliveryLocationDto deliveryLocationDto) {
		try {
			DeliveryLocation deliveryLocation=deliveryLocationMapper.toDeliveryLocation(deliveryLocationDto);
			return deliveryLocationMapper.toDeliveryLocationDto(deliveryLocationRepository.save(deliveryLocation));
		}
		catch(DataIntegrityViolationException e){
			throw new RecordAlreadyExistsException(ErrorMessage.DELIVEY_LOCATION_EXISTS.getMessage());
		}
	}

	
    /**
     * Retrieves the expected delivery days for a given state.
     *
     * @param state The name of the state.
     * @return The expected delivery days.
     * @throws DeliveryLocationNotFoundException if the location is not found.
     */
	@Override
	public int getExpectedDelivery(String state){
		Optional<DeliveryLocation> deliveryLocation= deliveryLocationRepository.findByDeliveryStateIgnoreCase(state);
		
		// If delivery location is found, return expected delivery days
		if(deliveryLocation.isPresent()) {
			return deliveryLocation.get().getExpectedDeliverydays();
		}
		else {
			throw new RecordNotFoundException(ErrorMessage.DELIVERY_LOCATION_NOT_AVAILABLE.getMessage());
		}
	}

	
    /**
     * Retrieves all available delivery locations.
     *
     * @return A list of delivery location DTOs.
     */
	@Override
	public List<DeliveryLocationDto> getAllDeliveryLocations() {
		
		List<DeliveryLocation> listOfDeliveryLocations=deliveryLocationRepository.findAll();
		
		return listOfDeliveryLocations.stream()
				.map(deliveryLocationMapper::toDeliveryLocationDto)
				.toList();
	}

    /**
     * Deletes a delivery location by its ID.
     *
     * @param id The ID of the delivery location to be deleted.
     */
	@Override
	public void deleteDeliveryLocation(long id) {
		deliveryLocationRepository.deleteById(id);
	}

}
