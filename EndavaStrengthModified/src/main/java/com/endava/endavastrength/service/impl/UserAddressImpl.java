package com.endava.endavastrength.service.impl;

import java.util.List;
import java.util.Optional;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.endava.endavastrength.dtos.UserAddressDto;
import com.endava.endavastrength.entities.UserAddress;
import com.endava.endavastrength.entities.Users;
import com.endava.endavastrength.enums.ErrorMessage;
import com.endava.endavastrength.exceptions.RecordNotFoundException;
import com.endava.endavastrength.mapper.UserAddressMapper;
import com.endava.endavastrength.repositories.UserAddressRepository;
import com.endava.endavastrength.service.UserAddressService;
import com.endava.endavastrength.service.UsersService;

import lombok.RequiredArgsConstructor;


/**
 * Implementation of UserAddressService that provides operations for managing user addresses.
 */
@Service
@RequiredArgsConstructor
public class UserAddressImpl implements UserAddressService{
	

	private final UserAddressMapper userAddressMapper;
	
	private final UsersService usersService;
	
	private final UserAddressRepository userAddressRepository;

	
    /**
     * Adds a new user address, ensuring only one default address per user.
     *
     * @param userAddressDto The user address data.
     * @return The saved user address details.
     */
	@Override
	@Transactional
	public UserAddressDto addAddress(UserAddressDto userAddressDto) {
		UserAddress userAddress=userAddressMapper.toAddress(userAddressDto);
		userAddress.setUser(usersService.fetchUserDetails(userAddressDto.userId()));
		
        // If the new address is set as default, update any existing default address
		if(userAddress.isDefault()) {
			Optional<UserAddress> existingDefaultAddressOpt=userAddressRepository.findByUser_userIdAndIsDefaultTrue(userAddressDto.userId());
			if(existingDefaultAddressOpt.isPresent()) {
				UserAddress existingUserAddress=existingDefaultAddressOpt.get();
				existingUserAddress.setDefault(false);
				userAddressRepository.save(existingUserAddress);
			}
		}
		UserAddress savedUserAddress=userAddressRepository.save(userAddress);
		return userAddressMapper.toAddressDto(savedUserAddress);
	}

    /**
     * Soft deletes a user address by marking it as inactive.
     *
     * @param id The ID of the address to be deleted.
     */
	@Override
	public void deleteAddress(long id) {
		UserAddress userAddress=userAddressRepository.findById(id).orElseThrow(()->new RecordNotFoundException(ErrorMessage.USER_ADDRESS_NOT_FOUND.getMessage()));
		userAddress.setActive(false);
		userAddressRepository.save(userAddress);
	}
	

    /**
     * Retrieves all active addresses associated with a user.
     *
     * @param userId The user's ID.
     * @return A list of user addresses.
     */
	@Override
	public List<UserAddressDto> getAllAddressesOfUser(long userId) {
		List<UserAddress> listOfUserAddresses = userAddressRepository
		        .findByUser_userId(userId)
		        .orElseThrow(() -> new RecordNotFoundException(ErrorMessage.USER_ADDRESS_NOT_FOUND.getMessage()));

		    return listOfUserAddresses.stream().filter(UserAddress::isActive)
		        .map(userAddressMapper::toAddressDto)
		        .toList();
	}
	
	
    /**
     * Updates an existing user address and ensures only one default address.
     *
     * @param userAddressDto The updated address details.
     * @return The updated user address.
     */
	@Transactional
	@Override
	public UserAddressDto updateUserAddress(UserAddressDto userAddressDto) {
		UserAddress userAddress=userAddressMapper.toAddress(userAddressDto);
		Users user = usersService.fetchUserDetails(userAddressDto.userId());
	    if (user == null) {
	        throw new RecordNotFoundException("User not found with ID: " + userAddressDto.userId());
	    }
	    userAddress.setUser(user);
	    	
	    // Ensure only one default address per user
		if(userAddress.isDefault()) {
			Optional<UserAddress> existingDefaultAddressOpt=userAddressRepository.findByUser_userIdAndIsDefaultTrue(userAddressDto.userId());
			if(existingDefaultAddressOpt.isPresent()) {
				UserAddress existingUserAddress=existingDefaultAddressOpt.get();
				existingUserAddress.setDefault(false);
				userAddressRepository.save(existingUserAddress);
			}
		}
		UserAddress savedUserAddress=userAddressRepository.save(userAddress);
		return userAddressMapper.toAddressDto(savedUserAddress);
		
	}

	
    /**
     * Finds a user address by its ID.
     *
     * @param id The address ID.
     * @return The found user address.
     */
	@Override
	public UserAddress findUserAddressById(long id) {
		return userAddressRepository.findById(id)
				.orElseThrow(()->new RecordNotFoundException(ErrorMessage.USER_ADDRESS_NOT_FOUND.getMessage()));
	}
	
	 
		
}	
