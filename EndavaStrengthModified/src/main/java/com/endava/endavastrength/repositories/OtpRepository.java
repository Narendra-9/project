package com.endava.endavastrength.repositories;

import java.time.LocalDateTime;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

import com.endava.endavastrength.entities.Otp;

@Repository
public interface OtpRepository extends JpaRepository<Otp, Long>{
	
	Optional<Otp> findByEmail(String email);
	
	
	@Transactional
	@Modifying
	@Query("DELETE FROM Otp o WHERE o.expiresAt < :expiresAt")
	int deleteByExpiresAtBefore(LocalDateTime expiresAt);
}
