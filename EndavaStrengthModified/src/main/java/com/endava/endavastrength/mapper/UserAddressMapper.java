package com.endava.endavastrength.mapper;

import org.springframework.stereotype.Component;

import com.endava.endavastrength.dtos.UserAddressDto;
import com.endava.endavastrength.entities.UserAddress;

@Component
public class UserAddressMapper {
	
	
	public UserAddress toAddress(UserAddressDto addressDto) {
		return UserAddress.builder()
						  .userAddressId(addressDto.userAddressId())
						  .fullName(addressDto.fullName())
						  .email(addressDto.email())
						  .mobileNo(addressDto.mobileNo())
						  .city(addressDto.city())
						  .address(addressDto.address())
						  .isDefault(addressDto.isDefault())
						  .pincode(addressDto.pincode())
						  .locality(addressDto.locality())
						  .state(addressDto.state())
						  .isActive(true)
						  .build();					
	}
	
	
	public UserAddressDto toAddressDto(UserAddress userAddress) {
		return new UserAddressDto(
				userAddress.getUserAddressId(),
				userAddress.getUser().getUserId(),
				userAddress.getFullName(),
				userAddress.getEmail(),
				userAddress.getMobileNo(),
				userAddress.getAddress(),
				userAddress.getLocality(),
				userAddress.getPincode(),
				userAddress.getCity(),
				userAddress.getState(),
				userAddress.isDefault());
	}
}
