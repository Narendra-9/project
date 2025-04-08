package com.endava.endavastrength.repositories;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import com.endava.endavastrength.entities.ProductNotification;
import com.endava.endavastrength.entities.Users;


@Repository
public interface ProductNotificationRepository extends JpaRepository<ProductNotification, Long>{
	
	Optional<ProductNotification> findByUser_UserIdAndProduct_ProductId(long userId, long productId);
	
	void deleteByUser_UserIdAndProduct_ProductId(long userId, long productId);
	
    // Custom query to get users who subscribed to a specific product
    @Query("SELECT pn.user FROM ProductNotification pn WHERE pn.product.id = :productId")
    List<Users> findUsersByProductId(Long productId);

}
