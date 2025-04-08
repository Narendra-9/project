package com.endava.endavastrength.repositories;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.endava.endavastrength.entities.DeliveryLocation;

@Repository
public interface DeliveryLocationRepository extends JpaRepository<DeliveryLocation, Long>{
	
	Optional<DeliveryLocation> findByDeliveryStateIgnoreCase(String deliveryState);
}
