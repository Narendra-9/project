package com.endava.endavastrength.dtos;

import com.endava.endavastrength.enums.Role;

public record LoginResponseDto(
		long userId, String userEmail, String userName, Role role, long esCashPoints, boolean isPremiumActive) {
}
