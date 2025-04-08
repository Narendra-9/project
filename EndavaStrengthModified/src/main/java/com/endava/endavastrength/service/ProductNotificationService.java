package com.endava.endavastrength.service;

import java.util.List;

import com.endava.endavastrength.dtos.ProductNotificationDto;
import com.endava.endavastrength.entities.Users;

public interface ProductNotificationService {
	
	ProductNotificationDto addNotification(ProductNotificationDto productNotificationDto);
	
	void deleteNotification(long userId, long productId);
	
    List<Users> getUsersByProductId(long productId);
    
    void notifyUsers(long productId);
}
