package com.endava.endavastrength.service.impl;

import java.security.InvalidKeyException;
import java.security.NoSuchAlgorithmException;
import java.util.List;
import java.util.Optional;

import javax.crypto.BadPaddingException;
import javax.crypto.IllegalBlockSizeException;
import javax.crypto.NoSuchPaddingException;

import org.springframework.stereotype.Service;

import com.endava.endavastrength.dtos.SavedCardDto;
import com.endava.endavastrength.entities.SavedCard;
import com.endava.endavastrength.enums.ErrorMessage;
import com.endava.endavastrength.exceptions.CardEncryptionException;
import com.endava.endavastrength.exceptions.RecordAlreadyExistsException;
import com.endava.endavastrength.exceptions.RecordNotFoundException;
import com.endava.endavastrength.mapper.SavedCardMapper;
import com.endava.endavastrength.repositories.SavedCardRepository;
import com.endava.endavastrength.service.SavedCardService;
import com.endava.endavastrength.service.UsersService;
import com.endava.endavastrength.util.EncryptionUtil;
import com.endava.endavastrength.util.HashUtil;

import lombok.RequiredArgsConstructor;


@Service
@RequiredArgsConstructor
public class SavedCardServiceImpl implements SavedCardService {

	private final SavedCardRepository savedCardRepository;
	
	private final HashUtil hashUtill;
	
	private final EncryptionUtil encryptionUtil;
	
	private final UsersService usersService;

	private final SavedCardMapper savedCardMapper;

	@Override
	public SavedCardDto saveCard(SavedCardDto savedCardDto) {

		SavedCard savedCard = savedCardMapper.toSavedCard(savedCardDto);
		savedCard.setUser(usersService.fetchUserDetails(savedCardDto.getUserId()));
		
		try {
			savedCard.setEncryptedCardNumber(encryptionUtil.encrypt(savedCardDto.getCardNumber()));
			savedCard.setEncryptedExpiry(encryptionUtil.encrypt(savedCardDto.getExpiry()));
			savedCard.setHashedCard(hashUtill.hashCard(savedCardDto.getCardNumber()));
		} catch (InvalidKeyException | NoSuchAlgorithmException | NoSuchPaddingException | IllegalBlockSizeException
				| BadPaddingException e) {
			throw new CardEncryptionException(ErrorMessage.ERROR_DECRYPTING_CARD.getMessage());
		}

		
		// Checking by HashValue, So that ensures Security by not fetching the entire card details
		Optional<SavedCard> existingCard = savedCardRepository.findByHashedCard(savedCard.getHashedCard());

		if (existingCard.isPresent()) {
			throw new RecordAlreadyExistsException(ErrorMessage.CARD_ALREADY_PRESENT.getMessage());
		}
		
		SavedCardDto savedCardDtoForDisplay=savedCardMapper.toSavedCardDtoForDisplay(savedCardRepository.save(savedCard));
		try {
			savedCardDtoForDisplay.setExpiry(encryptionUtil.decrypt(savedCard.getEncryptedExpiry()));
		} catch (InvalidKeyException | NoSuchAlgorithmException | NoSuchPaddingException | IllegalBlockSizeException
				| BadPaddingException e) {
			throw new CardEncryptionException(ErrorMessage.ERROR_ENCRYPTING_CARD.getMessage());
		}
		return savedCardDtoForDisplay;
	}

	@Override
	public List<SavedCardDto> getAllSavedCards(long userId) {

		List<SavedCard> listOfSavedCards = savedCardRepository.findByUser_UserId(userId);

		return listOfSavedCards.stream().map(savedCard -> {
	        SavedCardDto savedCardDto = savedCardMapper.toSavedCardDtoForDisplay(savedCard);
	        try {
	            savedCardDto.setExpiry(encryptionUtil.decrypt(savedCard.getEncryptedExpiry()));
	        } catch (InvalidKeyException | NoSuchAlgorithmException | NoSuchPaddingException | IllegalBlockSizeException
	                | BadPaddingException e) {
	            throw new CardEncryptionException(ErrorMessage.ERROR_DECRYPTING_CARD.getMessage());
	        }
	        return savedCardDto;
	    }).toList();
	}


	@Override
	public void deleteSavedCard(long savedCardId) {
		savedCardRepository.deleteById(savedCardId);
	}


	@Override
	public SavedCardDto retreiveCardDetails(long savedCardId){
		Optional<SavedCard> savedCardRecord = savedCardRepository.findById(savedCardId);
		if (savedCardRecord.isPresent()) {
			SavedCard savedCard = savedCardRecord.get();
			SavedCardDto savedCardDtoToRetrieve=savedCardMapper.toSavedCardDtoToRetrieve(savedCard);
			try {
				savedCardDtoToRetrieve.setCardNumber(encryptionUtil.decrypt(savedCard.getEncryptedCardNumber()));
				savedCardDtoToRetrieve.setExpiry(encryptionUtil.decrypt(savedCard.getEncryptedExpiry()));
			} catch (InvalidKeyException | NoSuchAlgorithmException | NoSuchPaddingException | IllegalBlockSizeException
					| BadPaddingException e) {
	            throw new CardEncryptionException(ErrorMessage.ERROR_DECRYPTING_CARD.getMessage());
			}
	
			return savedCardDtoToRetrieve;
			
		} else {
			throw new RecordNotFoundException(ErrorMessage.CARD_NOT_FOUND.getMessage());
		}
	}

}
