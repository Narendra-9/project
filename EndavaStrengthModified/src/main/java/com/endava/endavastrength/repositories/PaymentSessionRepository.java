package com.endava.endavastrength.repositories;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

import com.endava.endavastrength.entities.PaymentSession;

@Repository
public interface PaymentSessionRepository extends JpaRepository<PaymentSession, Long>{

	@Query("SELECT ps.id FROM PaymentSession ps WHERE ps.paymentSessionStatus = 'PENDING' AND ps.expiresAt < CURRENT_TIMESTAMP")
	List<Integer> findExpiredSessionIds();
	
	@Transactional
	@Modifying
	@Query("UPDATE PaymentSession ps SET ps.paymentSessionStatus = 'EXPIRED' WHERE ps.paymentSessionId IN :sessionIds")
	int markSessionsAsExpired(@Param("sessionIds") List<Integer> sessionIds);
	
	Optional<PaymentSession> findByOrder_OrderId(long orderId);
	
}
