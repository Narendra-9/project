package com.endava.endavastrength.controllers;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.endava.endavastrength.dtos.UserEditRequestDto;
import com.endava.endavastrength.dtos.UsersAdminDisplayDto;
import com.endava.endavastrength.entities.Users;
import com.endava.endavastrength.enums.StatusMessage;
import com.endava.endavastrength.response.ApiGenericResponse;
import com.endava.endavastrength.response.ApiGenericResponseUtil;
import com.endava.endavastrength.service.UsersService;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/users")
@RequiredArgsConstructor
public class UserController {
	
	private final UsersService usersService;
	
	@GetMapping("{id}")
	public Users fetchUserDetailsById(@PathVariable int id) {
		return usersService.fetchUserDetails(id);
	}
	
	@PutMapping(path="logout/{userId}")
	public ResponseEntity<String> logoutUser(@PathVariable int userId){
		usersService.logout(userId);
		return ResponseEntity.ok(StatusMessage.LOGOUT_SUCCESSFULLY.getMessage());
	}
	
	@PutMapping(path="edit-user")
	public ResponseEntity<ApiGenericResponse> editUser(@RequestBody UserEditRequestDto userEditRequestDto){
		Users user = usersService.editUser(userEditRequestDto);
		
		return ApiGenericResponseUtil.createSuccessResponse(user,
				StatusMessage.EDITED_USER.getMessage(),
				HttpStatus.OK);
	}
	
	
	@GetMapping(path="getAllUsers")
	public ResponseEntity<ApiGenericResponse> getAllUsers(){
		List<UsersAdminDisplayDto> listOfUsersDtos = usersService.getAllUsers();
		return ApiGenericResponseUtil.createSuccessResponse(listOfUsersDtos,
				StatusMessage.FETCHED_ALL_USERS.getMessage(),
				HttpStatus.OK);
	}
	
	
	@PutMapping(path="toggleActive")
	public ResponseEntity<ApiGenericResponse> toggleActive(@RequestParam int userId){
		UsersAdminDisplayDto usersAdminDisplayDto = usersService.toggleActive(userId);
		return ApiGenericResponseUtil.createSuccessResponse(usersAdminDisplayDto,
				StatusMessage.TOGGLE_USER_ACTIVE.getMessage(),
				HttpStatus.OK);
	}
	
}
