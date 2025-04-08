package com.endava.endavastrength.dtos;

public record UserAddressDto(

		long userAddressId,

		long userId,

		String fullName,

		String email,

		String mobileNo, 
		
		String address,

		String locality,

		String pincode,

		String city,

		String state,

		boolean isDefault) {
}
