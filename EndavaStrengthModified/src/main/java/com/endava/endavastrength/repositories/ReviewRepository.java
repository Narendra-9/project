package com.endava.endavastrength.repositories;

import java.util.Optional;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

import com.endava.endavastrength.entities.Review;

public interface ReviewRepository extends JpaRepository<Review, Long>{
	
	Page<Review> findByUserUserId(long userId,Pageable pageable);
	
	Optional<Review> findByUserUserIdAndProductProductId(long userId,long productId);
}
