package com.endava.endavastrength.repositories;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.endava.endavastrength.entities.SavedCard;

@Repository
public interface SavedCardRepository extends JpaRepository<SavedCard,Long>{
	
	Optional<SavedCard> findByHashedCard(String hashedCard);
	
	List<SavedCard> findByUser_UserId(long userId);
}
