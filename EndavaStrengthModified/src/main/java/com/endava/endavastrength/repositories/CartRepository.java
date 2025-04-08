package com.endava.endavastrength.repositories;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.endava.endavastrength.entities.Cart;
import com.endava.endavastrength.entities.Users;

@Repository
public interface CartRepository extends JpaRepository<Cart, Long>{
	
	Cart findByUser(Users user);
}
