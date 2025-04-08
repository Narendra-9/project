package com.endava.endavastrength.repositories;

import java.time.LocalDateTime;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.endava.endavastrength.entities.Payment;

@Repository
public interface PaymentRepository extends JpaRepository<Payment, Long>{
	
	@Query("SELECT COALESCE(SUM(p.paymentAmount), 0) FROM Payment p WHERE p.paymentStatus = 'SUCCESS'")
    long calculateTotalRevenue();
    
	@Query("SELECT COALESCE(SUM(p.paymentAmount), 0) FROM Payment p WHERE p.paymentStatus = 'SUCCESS' AND p.paymentDate BETWEEN :startOfDay AND :endOfDay")
	long calculateTodayRevenue(@Param("startOfDay") LocalDateTime startOfDay, @Param("endOfDay") LocalDateTime endOfDay);
    
    @Query("SELECT COUNT(p) FROM Payment p WHERE p.paymentStatus = 'SUCCESS'")
    int countTotalPayments();
    
    @Query("SELECT COUNT(p) FROM Payment p WHERE p.paymentStatus = 'FAILED'")
    int countFailedPayments();
}
