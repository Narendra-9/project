package com.endava.endavastrength.controllers;

import java.security.NoSuchAlgorithmException;
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

import com.endava.endavastrength.dtos.SavedCardDto;
import com.endava.endavastrength.enums.StatusMessage;
import com.endava.endavastrength.response.ApiGenericResponse;
import com.endava.endavastrength.response.ApiGenericResponseUtil;
import com.endava.endavastrength.service.SavedCardService;

import lombok.RequiredArgsConstructor;


/**
 * Controller for managing saved cards in the system.
 */
@RestController
@RequestMapping("/savedCard")
@RequiredArgsConstructor
public class SavedCardContoller {
	
	
    /**
     * Service for managing saved cards.
     * This service is injected using constructor injection.
     */
	private final SavedCardService savedCardService;
	
	
    /**
     * Saves a new card for a user.
     *
     * @param savedCardDto The card details to be saved.
     * @return ResponseEntity containing the saved card details.
     * @throws NoSuchAlgorithmException If there is an encryption-related issue.
     * @throws Exception If any other error occurs during saving.
     */
	@PostMapping(consumes = "application/json",produces = "application/json")
	public ResponseEntity<ApiGenericResponse> saveCard(@RequestBody SavedCardDto savedCardDto){
		
		SavedCardDto savedCardDtoResponse=savedCardService.saveCard(savedCardDto);
		
		// Using the utility class to create the success response
		return ApiGenericResponseUtil.createSuccessResponse(savedCardDtoResponse,
				StatusMessage.CARD_ADDED.getMessage(),
				HttpStatus.CREATED);
	}
	
	
    /**
     * Fetches all saved cards for a given user.
     *
     * @param userId The ID of the user whose saved cards need to be retrieved.
     * @return ResponseEntity containing the list of saved cards.
     */
	@GetMapping
	public ResponseEntity<ApiGenericResponse> getAllSavedCardsOfUser(@RequestParam int userId){
		List<SavedCardDto> listOfSavedCardDtos=savedCardService.getAllSavedCards(userId);
		
		// Using the utility class to create the success response
		return ApiGenericResponseUtil.createSuccessResponse(listOfSavedCardDtos,
				StatusMessage.FETCHED_SAVED_CARDS.getMessage(),
				HttpStatus.OK);
	}
	
    /**
     * Retrieves a specific saved card's details.(Decrypting the saved card data and sending whenever needed)
     *
     * @param savedCardId The ID of the saved card to retrieve.
     * @return ResponseEntity containing the saved card details.
     * @throws Exception If there is an error during retrieval.
     */
	@GetMapping("/retrieve")
	public ResponseEntity<ApiGenericResponse> reteiveSavedCard(@RequestParam int savedCardId){
		SavedCardDto savedCard=savedCardService.retreiveCardDetails(savedCardId);
		
		// Using the utility class to create the success response
		return ApiGenericResponseUtil.createSuccessResponse(savedCard,
				StatusMessage.RETRIEVED_SAVED_CARD.getMessage(),
				HttpStatus.OK);
	}
	
	
    /**
     * Deletes a saved card based on its ID.
     *
     * @param savedCardId The ID of the saved card to delete.
     * @return ResponseEntity confirming the deletion status.
     */
	@DeleteMapping
	public ResponseEntity<String> deleteSavedCard(@RequestParam int savedCardId){
		savedCardService.deleteSavedCard(savedCardId);
		return ResponseEntity.ok(StatusMessage.CARD_DELETED.getMessage());
	}
}
