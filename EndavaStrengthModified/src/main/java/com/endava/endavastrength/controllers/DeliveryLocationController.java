package com.endava.endavastrength.controllers;

import java.util.List;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import com.endava.endavastrength.dtos.DeliveryLocationDto;
import com.endava.endavastrength.enums.StatusMessage;
import com.endava.endavastrength.response.ApiGenericResponse;
import com.endava.endavastrength.response.ApiGenericResponseUtil;
import com.endava.endavastrength.service.DeliveryLocationService;
import lombok.RequiredArgsConstructor;


/**
 * Controller for handling delivery location-related operations.
 */
@RestController
@RequestMapping("/delivery")
@RequiredArgsConstructor
public class DeliveryLocationController {
	
    /**
     * Service for handling delivery location operations.
     */
	private final DeliveryLocationService deliveryLocationService;
	
	
    /**
     * Adds a new delivery location.
     *
     * @param deliveryLocationDto DTO containing delivery location details.
     * @return Response containing the added delivery location and a success message.
     *
     */
	@PostMapping(consumes = {"application/json"},produces = {"application/json"})
	public ResponseEntity<ApiGenericResponse> addDeliveryLocation(@RequestBody DeliveryLocationDto deliveryLocationDto) {
		
		DeliveryLocationDto deliveryLocationDtoResponse=deliveryLocationService.addDeliveyLocation(deliveryLocationDto);
		
		// Using the utility class to create the success response
		return ApiGenericResponseUtil.createSuccessResponse(deliveryLocationDtoResponse, 
															StatusMessage.DELIVERY_LOCATION_ADDED.getMessage(), 
															HttpStatus.CREATED);
		
	}
	
    /**
     * Retrieves the expected delivery time for a given state.
     *
     * @param state The name of the state.
     * @return Response containing the expected delivery days.
     */
	@GetMapping(path = "/expectedDelivery/{state}")
	public ResponseEntity<ApiGenericResponse> getExpectedDelivery(@PathVariable String state){
		
		int expectedDeliveryDays=deliveryLocationService.getExpectedDelivery(state);
		
		// Using the utility class to create the success response
		return ApiGenericResponseUtil.createSuccessResponse(expectedDeliveryDays, 
															StatusMessage.EXPECTED_DELIVERY_FETCHED.getMessage(),
															HttpStatus.OK);
	}
	
	@GetMapping
	public ResponseEntity<ApiGenericResponse> getAllDeliveryLocations(){
		
		List<DeliveryLocationDto> listOfAllDeliveryLocationDtos=deliveryLocationService.getAllDeliveryLocations();
		
		// Using the utility class to create the success response
		return ApiGenericResponseUtil.createSuccessResponse(listOfAllDeliveryLocationDtos, 
															StatusMessage.FETCHED_ALL_DELIVERY_LOCATIONS.getMessage(),
															HttpStatus.OK);
	}
	
	@DeleteMapping(path = "delete/{id}")
	public ResponseEntity<String> deleteDeliveryLocation(@PathVariable int id){
		deliveryLocationService.deleteDeliveryLocation(id);
		return ResponseEntity.ok("Success");
	}
}
