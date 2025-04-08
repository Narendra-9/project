package com.endava.endavastrength.service.impl;

import java.time.LocalDateTime;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.endava.endavastrength.dtos.CartDto;
import com.endava.endavastrength.entities.Orders;
import com.endava.endavastrength.entities.Product;
import com.endava.endavastrength.entities.Users;
import com.endava.endavastrength.repositories.OrdersRepository;
import com.endava.endavastrength.service.PremiumCartService;
import com.endava.endavastrength.service.PremiumService;
import com.endava.endavastrength.service.ProductService;
import com.endava.endavastrength.service.UsersService;

import lombok.RequiredArgsConstructor;

/**
 * Implementation of {@link PremiumService} that handles premium membership logic,
 * including granting premium status, checking eligibility, and adding premium to the cart.
 */
@Service
@RequiredArgsConstructor
public class PremiumServiceImpl implements PremiumService{
	
	private final UsersService usersService;
	
	private final ProductService productService;	
	
	private final OrdersRepository ordersRepository;
	
	private final PremiumCartService premiumCartService;
	
    /**
     * Activates premium membership for a user if they have purchased a premium membership product.
     *
     * @param user  The user who made the purchase.
     * @param order The order containing purchased items.
     */
	@Override
	@Transactional
	public void activatePremiumIfPurchased(Users user, Orders order) {
		
		// Iterating over the purchased Items and checking if premium exists or not.
	    boolean boughtPremium = order.getListOfOrderItems().stream()
	            .anyMatch(item -> item.getProduct().getSlug().contains("premium-membership"));
	    
	    // If Premium exists setting up the user attributes to serve as premium user.
	    if(boughtPremium) {
	        user.setPremium(true);
	        user.setPremiumExpiry(LocalDateTime.now().plusMonths(12));
	        usersService.updateUser(user);
	    }
		
	}
	
    /**
     * Grants premium membership to a user if their total spending exceeds ₹20,000.
     *
     * @param user The user whose spending is being caluclated.
     */
	@Override
	@Transactional
	public void checkAndGrantPremium(Users user) {
		
		// Getting the total amount spent by a use through atomic query.
	    long totalSpent = ordersRepository.getTotalSpentByUser(user.getUserId());

	    if (totalSpent >= 10000 && !user.isPremiumActive()) {
	        user.setPremium(true);
	        user.setPremiumExpiry(LocalDateTime.now().plusMonths(12)); // 1-year premium
	        usersService.updateUser(user);
	    }
	}
	
	
    /**
     * Adds a premium membership product to the user's cart.
     *
     * @param userId The ID of the user adding premium membership.
     * @return Updated CartDto containing the user's cart details.
     */
	@Override
	@Transactional
	public CartDto addPremiumToCart(long userId) {
		
		Users user=usersService.fetchUserDetails(userId);
		Product product=productService.findBySlug("mb-premium-membership-12-months");
		
		return premiumCartService.addPremiumToCart(user, product);
	}

}
