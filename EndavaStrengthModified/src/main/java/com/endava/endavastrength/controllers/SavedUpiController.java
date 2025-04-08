package com.endava.endavastrength.controllers;

import java.util.List;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import com.endava.endavastrength.dtos.SavedUpiDto;
import com.endava.endavastrength.enums.StatusMessage;
import com.endava.endavastrength.response.ApiGenericResponse;
import com.endava.endavastrength.response.ApiGenericResponseUtil;
import com.endava.endavastrength.service.SavedUpiService;
import lombok.RequiredArgsConstructor;


/**
 * Controller for managing saved UPI IDs.
 */
@RestController
@RequestMapping("/savedUpi")
@RequiredArgsConstructor
public class SavedUpiController {
	
	
    /**
     * Service for managing saved UPI IDs.
     * This service is injected using constructor injection.
     */
	private final SavedUpiService savedUpiService;
	
	
	/**
	 * Saves a new UPI ID for the user.
	 *
	 * @param savedUpiDto DTO containing UPI details.
	 * @return Response entity containing the saved UPI details.
	 * @throws Exception If encryption or saving fails.
	 */
	@PostMapping(consumes = "application/json",produces = "application/json")
	public ResponseEntity<ApiGenericResponse> saveUpi(@RequestBody SavedUpiDto savedUpiDto){
		
		SavedUpiDto savedUpiDtoResponse=savedUpiService.saveUpi(savedUpiDto);
		
		// Using the utility class to create the success response
		return ApiGenericResponseUtil.createSuccessResponse(savedUpiDtoResponse,
															StatusMessage.UPI_SAVED.getMessage(),
															HttpStatus.OK);
	}
	
	
	/**
	 * Retrieves all saved UPI IDs for a given user.
	 *
	 * @param userId The ID of the user.
	 * @return Response entity containing a list of saved UPI details.
	 */
	@GetMapping
	public ResponseEntity<ApiGenericResponse> getAllUpiIdsOfUser(@RequestParam int userId){
		
		List<SavedUpiDto> listOfSavedUpiDtos=savedUpiService.getAllSavedUpis(userId);
		
		// Using the utility class to create the success response
		return ApiGenericResponseUtil.createSuccessResponse(listOfSavedUpiDtos,
				StatusMessage.USER_UPI_FETCHED.getMessage(),
				HttpStatus.OK);
	}
	
	
	/**
	 * Retrieves decrypted UPI details for a given user.
	 *
	 * @param userId The ID of the user.
	 * @return Response entity containing decrypted UPI details.
	 * @throws Exception If decryption fails.
	 */
	@GetMapping("/retreive")
	public ResponseEntity<ApiGenericResponse> getAllDecryptedUserIds(@RequestParam int userId){
		
		SavedUpiDto retrievedSavedUpiDto=savedUpiService.retreiveUpiDetails(userId);
		
		// Using the utility class to create the success response
		return ApiGenericResponseUtil.createSuccessResponse(retrievedSavedUpiDto,
				StatusMessage.USER_UPI_FETCHED.getMessage(),
				HttpStatus.OK);
	}
	
	
	/**
	 * Deletes a saved UPI ID.
	 *
	 * @param savedUpiId The ID of the saved UPI to be deleted.
	 * @return Response entity confirming deletion.
	 */
	@DeleteMapping
	public ResponseEntity<String> deleteUpiId(@RequestParam int savedUpiId){
		savedUpiService.deleteSavedUpi(savedUpiId);
		return ResponseEntity.ok(StatusMessage.UPI_DELETED.getMessage());
	}
	
}
