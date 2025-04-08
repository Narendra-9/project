package com.endava.endavastrength.repositories;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.endava.endavastrength.entities.SavedUpi;

@Repository
public interface SavedUpiRepository extends JpaRepository<SavedUpi, Long>{
	
	Optional<SavedUpi> findByHashedUpiId(String hashedUpiId);
	
	List<SavedUpi> findByUser_UserId(long userId);
}
