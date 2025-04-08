package com.endava.endavastrength.controllers;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.endava.endavastrength.dtos.UserAddressDto;
import com.endava.endavastrength.enums.StatusMessage;
import com.endava.endavastrength.response.ApiGenericResponse;
import com.endava.endavastrength.response.ApiGenericResponseUtil;
import com.endava.endavastrength.service.UserAddressService;

import lombok.RequiredArgsConstructor;


/**
 * Controller for handling user address operations.
 */
@RestController
@RequestMapping("/user-address")
@RequiredArgsConstructor
public class UserAddressController {
	
	
    /**
     * Service for managing user addresses.
     * This service is injected using constructor injection.
     */
	private final UserAddressService userAddressService;
	
	
    /**
     * Retrieves all addresses associated with a specific user.
     *
     * @param userId The ID of the user.
     * @return A response entity containing a list of user addresses.
     */
	@GetMapping(path = "/{userId}")
	public ResponseEntity<ApiGenericResponse> getAlladdressesOfUser(@PathVariable int userId){
		
		List<UserAddressDto> listOfUserAddressDtos=userAddressService.getAllAddressesOfUser(userId);
		
		// Using the utility class to create the success response
		return ApiGenericResponseUtil.createSuccessResponse(listOfUserAddressDtos,
															StatusMessage.FETCHED_USER_ADDRESSES.getMessage(),
															HttpStatus.OK);
	}
	
	
    /**
     * Adds a new user address.
     *
     * @param userAddressDto The user address details.
     * @return A response entity containing the saved address details.
     */
	@PostMapping(path = "/add-address",consumes = "application/json",produces = "application/json")
	public ResponseEntity<ApiGenericResponse> addUserAddress(@RequestBody UserAddressDto userAddressDto){
		
		UserAddressDto userAddressresponse=userAddressService.addAddress(userAddressDto);
		
		// Using the utility class to create the success response
		return ApiGenericResponseUtil.createSuccessResponse(userAddressresponse,
				StatusMessage.ADDRESS_ADDED.getMessage(),
				HttpStatus.CREATED);
	}
	
	
    /**
     * Updates an existing user address.
     *
     * @param userAddressDto The updated address details.
     * @return A response entity containing the updated address.
     */
	@PutMapping(path = "/update-address",consumes = "application/json",produces = "application/json")
	public ResponseEntity<ApiGenericResponse> updateUserAddress(@RequestBody UserAddressDto userAddressDto){
		
		UserAddressDto userAddressRespone=userAddressService.updateUserAddress(userAddressDto);
		
		// Using the utility class to create the success response
		return ApiGenericResponseUtil.createSuccessResponse(userAddressRespone,
				StatusMessage.ADDRESS_EDITED.getMessage(),
				HttpStatus.OK);
	}
	
    /**
     * Deletes a user address.
     *
     * @param id The ID of the address to delete.
     * @return A response entity confirming the deletion.
     */
	@DeleteMapping(path = "/delete/{id}")
	public ResponseEntity<String> deleteUserAddress(@PathVariable int id){
		
		userAddressService.deleteAddress(id);
		return ResponseEntity.ok(StatusMessage.ADDRESS_DELETED.getMessage());
	}
}
