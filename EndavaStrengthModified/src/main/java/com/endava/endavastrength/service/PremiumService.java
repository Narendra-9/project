package com.endava.endavastrength.service;

import com.endava.endavastrength.dtos.CartDto;
import com.endava.endavastrength.entities.Orders;
import com.endava.endavastrength.entities.Users;

public interface PremiumService {
	
	public void activatePremiumIfPurchased(Users user,Orders order);
	
	public void checkAndGrantPremium(Users user);
	
	public CartDto addPremiumToCart(long userId);
	
}
