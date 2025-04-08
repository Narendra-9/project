package com.endava.endavastrength.service;

import java.util.List;

import com.endava.endavastrength.dtos.UserAddressDto;
import com.endava.endavastrength.entities.UserAddress;

public interface UserAddressService {
	
	List<UserAddressDto> getAllAddressesOfUser(long userId);
	
	UserAddressDto addAddress(UserAddressDto userAddressDto);
	
	void deleteAddress(long id);
	
	UserAddressDto updateUserAddress(UserAddressDto userAddressDto);
	
	UserAddress findUserAddressById(long id);
}
