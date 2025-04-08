package com.endava.endavastrength.service.impl;

import org.springframework.stereotype.Service;

import com.endava.endavastrength.repositories.OrderItemsRepository;
import com.endava.endavastrength.service.OrderItemsService;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class OrderItemsServiceImpl implements OrderItemsService{
	
	private final OrderItemsRepository orderItemsRepository;

	@Override
	public boolean itemExistsInOrderHistory(long userId, long productId) {
		return orderItemsRepository.existsByOrderUserUserIdAndProductProductId(userId, productId);
	}
	
}
