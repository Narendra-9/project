package com.endava.endavastrength.repositories;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.endava.endavastrength.entities.Cart;
import com.endava.endavastrength.entities.CartItem;
import com.endava.endavastrength.entities.Product;


@Repository
public interface CartItemRepository extends JpaRepository<CartItem, Long>{
	
	Optional<CartItem> findByCartAndProduct(Cart cart, Product product);

}
