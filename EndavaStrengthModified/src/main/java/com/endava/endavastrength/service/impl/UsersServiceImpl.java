package com.endava.endavastrength.service.impl;

import java.util.List;
import java.util.Optional;

import org.springframework.stereotype.Service;

import com.endava.endavastrength.dtos.UserEditRequestDto;
import com.endava.endavastrength.dtos.UserOrderSumAndCount;
import com.endava.endavastrength.dtos.UsersAdminDisplayDto;
import com.endava.endavastrength.entities.Cart;
import com.endava.endavastrength.entities.Users;
import com.endava.endavastrength.enums.ErrorMessage;
import com.endava.endavastrength.enums.Role;
import com.endava.endavastrength.exceptions.RecordNotFoundException;
import com.endava.endavastrength.exceptions.UserNotFoundException;
import com.endava.endavastrength.mapper.UsersMapper;
import com.endava.endavastrength.repositories.OrdersRepository;
import com.endava.endavastrength.repositories.UsersRepository;
import com.endava.endavastrength.service.UsersService;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class UsersServiceImpl implements UsersService{
	
	private final UsersRepository usersRepository;	
	
	private final OrdersRepository ordersRepository;
	
	private final UsersMapper usersMapper;

	@Override
	public Users createOrRetrieveUser(String email) {
		Optional<Users> existingUser=usersRepository.findByUserEmail(email);
		if(existingUser.isPresent()) {
			Users user=existingUser.get();
			user.setLoggedIn(true);
			usersRepository.save(user);
			return user;
		}
		else {
			Users user=new Users();
			Cart cart=new Cart();
			user.setUserEmail(email);
			user.setEsCashPoints(0);
			user.setActive(true);
			user.setCart(cart);
			cart.setUser(user);
			user.setRole(Role.USER);
			user.setLoggedIn(true);
			return usersRepository.save(user);
		}
	}

	@Override
	public Users fetchUserDetails(long userId) {
		Optional<Users> user = usersRepository.findById(userId);
		if(user.isPresent()) {
			return user.get();
		}
		else {
			throw new UserNotFoundException(ErrorMessage.USER_NOT_FOUND.getMessage());
		}
	}

	@Override
	public void logout(long userId) {
		Optional<Users> userRecord= usersRepository.findById(userId);
		if(userRecord.isPresent()) {
			Users user=userRecord.get();
			user.setLoggedIn(false);
			usersRepository.save(user);
		}
		else {
			throw new UserNotFoundException(ErrorMessage.USER_NOT_FOUND.getMessage());
		}
		
		
	}

	@Override
	public Users editUser(UserEditRequestDto userEditRequestDto) {
		Optional<Users> existingUserRecord=usersRepository.findById(userEditRequestDto.userId());
		if(existingUserRecord.isPresent()) {
			Users existingUser=existingUserRecord.get();
			existingUser.setGender(userEditRequestDto.gender());
			existingUser.setUserName(userEditRequestDto.userName());
			existingUser.setPhoneNumber(userEditRequestDto.phoneNumber());
			existingUser.setUserEmail(userEditRequestDto.userEmail());
			return usersRepository.save(existingUser);
		}
		else {
			throw new UserNotFoundException(ErrorMessage.USER_NOT_FOUND.getMessage());
		}
	}

	@Override
	public Users updateUser(Users users) {
		return usersRepository.save(users);
	}

	@Override
	public List<UsersAdminDisplayDto> getAllUsers() {
		List<Users> listOfAllUsers=usersRepository.getAllOnlyUsers();
		return listOfAllUsers.stream()
				 .map(this::toUsersAdminDisplayDto)
				 .toList();
	}

	@Override
	public UsersAdminDisplayDto toggleActive(long userId) {
		Users user=usersRepository.findById(userId).orElseThrow(()->new RecordNotFoundException("User Not Found"));
		user.setActive(!user.isActive());
		return this.toUsersAdminDisplayDto(usersRepository.save(user));
	}
	
	private UsersAdminDisplayDto toUsersAdminDisplayDto(Users user) {
		
		UsersAdminDisplayDto usersAdminDisplayDto=usersMapper.toUsersAdminDisplayDto(user);
		
		// Getting Order's Count and Sum by using atomic query.
	    UserOrderSumAndCount userOrderSumAndCount=ordersRepository.findTotalOrderAmountAndCountByUserId(user.getUserId());
	    
	    long totalPrice = (userOrderSumAndCount != null) ? userOrderSumAndCount.totalPrice() : 0;
	    long orderCount = (userOrderSumAndCount != null) ? userOrderSumAndCount.orderCount() : 0;
	    
	    usersAdminDisplayDto.setOrderedAmount(totalPrice);
	    usersAdminDisplayDto.setNoOfOrdersPlaced(orderCount);
	    
	    return usersAdminDisplayDto;
	}

	@Override
	public boolean userExists(long userId) {
		return usersRepository.existsByUserId(userId);
	}

}
