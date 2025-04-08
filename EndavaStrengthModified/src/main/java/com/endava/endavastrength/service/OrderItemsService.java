package com.endava.endavastrength.service;

public interface OrderItemsService {
	
	boolean itemExistsInOrderHistory(long userId, long productId);
}
