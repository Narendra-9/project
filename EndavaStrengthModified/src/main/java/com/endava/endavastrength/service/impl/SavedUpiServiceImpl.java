package com.endava.endavastrength.service.impl;

import java.security.InvalidKeyException;
import java.security.NoSuchAlgorithmException;
import java.util.List;
import java.util.Optional;

import javax.crypto.BadPaddingException;
import javax.crypto.IllegalBlockSizeException;
import javax.crypto.NoSuchPaddingException;

import org.springframework.stereotype.Service;

import com.endava.endavastrength.dtos.SavedUpiDto;
import com.endava.endavastrength.entities.SavedUpi;
import com.endava.endavastrength.entities.Users;
import com.endava.endavastrength.enums.ErrorMessage;
import com.endava.endavastrength.exceptions.CardEncryptionException;
import com.endava.endavastrength.exceptions.RecordAlreadyExistsException;
import com.endava.endavastrength.exceptions.RecordNotFoundException;
import com.endava.endavastrength.mapper.SavedUpiIdMapper;
import com.endava.endavastrength.repositories.SavedUpiRepository;
import com.endava.endavastrength.service.SavedUpiService;
import com.endava.endavastrength.service.UsersService;
import com.endava.endavastrength.util.EncryptionUtil;
import com.endava.endavastrength.util.HashUtil;
import lombok.RequiredArgsConstructor;


@Service
@RequiredArgsConstructor
public class SavedUpiServiceImpl implements SavedUpiService {

	private final SavedUpiRepository savedUpiRepository;

	private final UsersService usersService;

	private final SavedUpiIdMapper savedUpiIdMapper;
	
	private final EncryptionUtil encryptionUtil;
	
	private final HashUtil hashUtil;


	@Override
	public SavedUpiDto saveUpi(SavedUpiDto savedUpiDto){
		SavedUpi savedUpi = new SavedUpi();
		savedUpi.setUser(usersService.fetchUserDetails(savedUpiDto.getUserId()));
		
		try {
			savedUpi.setHashedUpiId(hashUtil.hashCard(savedUpiDto.getUpiId()));
			savedUpi.setEncryptedUpiId(encryptionUtil.encrypt(savedUpiDto.getUpiId()));
		} catch (NoSuchAlgorithmException | InvalidKeyException | NoSuchPaddingException | IllegalBlockSizeException | BadPaddingException e) {
			throw new CardEncryptionException(ErrorMessage.ERROR_ENCRYPTING_UPI.getMessage());
		}
		
		
		Optional<SavedUpi> existingUpiId = savedUpiRepository.findByHashedUpiId(savedUpi.getHashedUpiId());
		if (existingUpiId.isPresent()) {
			throw new RecordAlreadyExistsException(ErrorMessage.UPIID_ALREADY_PRESET.getMessage());
		}
		
		
		try {
			SavedUpi savedUpiEntity = savedUpiRepository.save(savedUpi);
			SavedUpiDto savedUpiDtoDisplayDto=savedUpiIdMapper.toSavedUpiDtoDisplay(savedUpiEntity);
			savedUpiDtoDisplayDto.setMaskedUpiId(maskUPI(encryptionUtil.decrypt(savedUpi.getEncryptedUpiId())));
			return savedUpiDtoDisplayDto;
		} catch (InvalidKeyException | NoSuchAlgorithmException | NoSuchPaddingException | IllegalBlockSizeException
				| BadPaddingException e) {
	        throw new CardEncryptionException(ErrorMessage.ERROR_DECRYPTING_UPI.getMessage());
		}
		
		
	}


	@Override
	public List<SavedUpiDto> getAllSavedUpis(long userId) {

		// This checks whether the user is there or not
		Users user = usersService.fetchUserDetails(userId);

		List<SavedUpi> listOfSavedUpis = savedUpiRepository.findByUser_UserId(user.getUserId());

		return listOfSavedUpis.stream().map(savedUpi -> {
				SavedUpiDto savedUpiDtoDisplayDto=savedUpiIdMapper.toSavedUpiDtoDisplay(savedUpi);
				try {
					savedUpiDtoDisplayDto.setMaskedUpiId(maskUPI(encryptionUtil.decrypt(savedUpi.getEncryptedUpiId())));
				} catch (InvalidKeyException | NoSuchAlgorithmException | NoSuchPaddingException
						| IllegalBlockSizeException | BadPaddingException e) {
					throw new CardEncryptionException(ErrorMessage.ERROR_DECRYPTING_UPI.getMessage());
				}
				return savedUpiDtoDisplayDto;
		}).toList();
	}


	@Override
	public void deleteSavedUpi(long savedUpiId) {
		savedUpiRepository.deleteById(savedUpiId);
	}


	@Override
	public SavedUpiDto retreiveUpiDetails(long savedUpiId){
		Optional<SavedUpi> savedUpiRecord = savedUpiRepository.findById(savedUpiId);
		if (savedUpiRecord.isPresent()) {
			SavedUpi existingUpi = savedUpiRecord.get();
			SavedUpiDto savedUpiDtoRetreive= savedUpiIdMapper.toSavedUpiDtoRetreive(existingUpi);
			try {
				savedUpiDtoRetreive.setUpiId(encryptionUtil.decrypt(existingUpi.getEncryptedUpiId()));
			} catch (InvalidKeyException | NoSuchAlgorithmException | NoSuchPaddingException | IllegalBlockSizeException
					| BadPaddingException e) {
				throw new CardEncryptionException(ErrorMessage.ERROR_DECRYPTING_UPI.getMessage());
			}
			return savedUpiDtoRetreive;
		} else {
			throw new RecordNotFoundException(ErrorMessage.SAVED_UPI_NOT_FOUND.getMessage());
		}
	}
	
	
	private String maskUPI(String upiId) {
		
		if (upiId == null || !upiId.contains("@")) {
            return "Invalid UPI ID";
        }

        String[] parts = upiId.split("@");
        String username = parts[0]; 
        String domain = parts[1];

        if (username.length() <= 2) {
            return username + "@***";
        }

        String maskedUsername = username.substring(0, 2) + "*".repeat(username.length() - 3)+username.substring(username.length() - 1);

        return maskedUsername + "@" + domain; 
	}

}
