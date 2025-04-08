package com.endava.endavastrength.repositories;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import com.endava.endavastrength.entities.Users;

@Repository
public interface UsersRepository extends JpaRepository<Users, Long>{
	
	Optional <Users> findByUserEmail(String email);
	
	@Query("SELECT COUNT(u) FROM Users u WHERE u.createdAt >= CURRENT_DATE")
    int countNewRegistrations();
	
	@Query("SELECT u FROM Users u WHERE u.role = com.endava.endavastrength.enums.Role.USER")
	List<Users> getAllOnlyUsers();
	
	boolean existsByUserId(long userId);
}
