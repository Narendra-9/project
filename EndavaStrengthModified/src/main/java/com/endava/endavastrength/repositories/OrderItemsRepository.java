package com.endava.endavastrength.repositories;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.endava.endavastrength.entities.OrderItems;

@Repository
public interface OrderItemsRepository extends JpaRepository<OrderItems, Long>{
			
	boolean existsByOrderUserUserIdAndProductProductId(long userId,long productId);
}
