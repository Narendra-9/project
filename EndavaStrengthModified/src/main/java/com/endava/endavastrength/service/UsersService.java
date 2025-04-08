package com.endava.endavastrength.service;

import java.util.List;

import com.endava.endavastrength.dtos.UserEditRequestDto;
import com.endava.endavastrength.dtos.UsersAdminDisplayDto;
import com.endava.endavastrength.entities.Users;

public interface UsersService {
	
	Users createOrRetrieveUser(String email);
	
	Users fetchUserDetails(long userId);
	
	void logout(long userId);
	
	Users editUser(UserEditRequestDto userEditRequestDto);
	
	Users updateUser(Users users);
	
	List<UsersAdminDisplayDto> getAllUsers();
	
	UsersAdminDisplayDto toggleActive(long userId);
	
	boolean userExists(long userId);
} 
