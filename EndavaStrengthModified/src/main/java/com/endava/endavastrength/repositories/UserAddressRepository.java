package com.endava.endavastrength.repositories;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.endava.endavastrength.entities.UserAddress;

@Repository
public interface UserAddressRepository extends JpaRepository<UserAddress, Long>{
	
	Optional<List<UserAddress>> findByUser_userId(long userId);
	
	Optional<UserAddress> findByUser_userIdAndIsDefaultTrue(long userId);

}
