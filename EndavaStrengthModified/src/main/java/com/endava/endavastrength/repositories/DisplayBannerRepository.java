package com.endava.endavastrength.repositories;

import java.time.LocalDate;
import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.endava.endavastrength.entities.DisplayBanner;

public interface DisplayBannerRepository extends JpaRepository<DisplayBanner, Long>{
	
    List<DisplayBanner> findByValidityGreaterThanEqualOrValidityIsNull(LocalDate currentDate);

}
