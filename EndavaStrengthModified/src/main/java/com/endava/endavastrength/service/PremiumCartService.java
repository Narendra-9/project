package com.endava.endavastrength.service;

import com.endava.endavastrength.dtos.CartDto;
import com.endava.endavastrength.entities.Product;
import com.endava.endavastrength.entities.Users;

public interface PremiumCartService {
	
	CartDto addPremiumToCart(Users user, Product premiumMembership);
}
