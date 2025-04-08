package com.endava.endavastrength.repositories;

import java.util.List;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.endava.endavastrength.dtos.UserOrderSumAndCount;
import com.endava.endavastrength.entities.Orders;
import com.endava.endavastrength.enums.OrderStatus;

@Repository
public interface OrdersRepository extends JpaRepository<Orders, Long>{

	@Query("SELECT o FROM Orders o WHERE o.paymentSession.paymentSessionId IN :sessionIds")
	List<Orders> findOrdersBySessionIds(@Param("sessionIds") List<Integer> sessionIds);
	
	Page<Orders> findByUser_UserId(long userId,Pageable pageable);
	
	long countByOrderStatus(OrderStatus orderStatus);
	
	Page<Orders> findByOrderStatusNot(OrderStatus orderStatus,Pageable pageable);
	
	@Query("SELECT new com.endava.endavastrength.dtos.UserOrderSumAndCount(COALESCE(SUM(o.totalPrice), 0), COALESCE(COUNT(o), 0)) FROM Orders o WHERE o.user.userId = :userId")
	UserOrderSumAndCount findTotalOrderAmountAndCountByUserId(@Param("userId") long userId);
	
	@Query("SELECT COALESCE(SUM(o.totalOrderValue),0) FROM Orders o WHERE o.user.userId = :userId")
	long getTotalSpentByUser(@Param("userId") long userId);

}
