package com.endava.endavastrength.dtos;

public record UserEditRequestDto(

		long userId,

		String userName,

		String userEmail,

		String gender,

		String phoneNumber) {
}
