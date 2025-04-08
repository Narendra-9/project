package com.endava.endavastrength.repositories;



import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.endava.endavastrength.entities.Product;
import com.endava.endavastrength.entities.Users;
import com.endava.endavastrength.entities.WishListItem;



@Repository
public interface WishListItemRepository extends JpaRepository<WishListItem, Long>{
	
	List<WishListItem> findByUser_UserId(long userId);
	
	Optional<WishListItem> findByUserAndProduct(Users user, Product product);
}
