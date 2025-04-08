package com.endava.endavastrength.service.impl;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.stereotype.Service;

import com.endava.endavastrength.dtos.DisplayBannerDto;
import com.endava.endavastrength.entities.DisplayBanner;
import com.endava.endavastrength.enums.ErrorMessage;
import com.endava.endavastrength.exceptions.RecordAlreadyExistsException;
import com.endava.endavastrength.exceptions.RecordNotFoundException;
import com.endava.endavastrength.mapper.DisplayBannerMapper;
import com.endava.endavastrength.repositories.DisplayBannerRepository;
import com.endava.endavastrength.service.DisplayBannerService;

import lombok.RequiredArgsConstructor;

/**
 * Implementation of the DisplayBannerService interface. Provides business logic
 * for managing display banners.
 */
@Service
@RequiredArgsConstructor
public class DisplayBannerServiceImpl implements DisplayBannerService {

	private final DisplayBannerRepository displayBannerRepository;

	private final DisplayBannerMapper displayBannerMapper;

	/**
	 * Retrieves all valid banners whose validity date is greater than or equal to
	 * the current date or those that have no validity date.
	 *
	 * @return List of valid DisplayBannerDto objects.
	 */
	@Override
	public List<DisplayBannerDto> getAllValidBanners() {
		List<DisplayBanner> validBanners = displayBannerRepository
				.findByValidityGreaterThanEqualOrValidityIsNull(LocalDate.now());

		return validBanners.stream().map(displayBannerMapper::toDisplayBannerDto).toList();
	}

	/**
	 * Retrieves all banners (both valid and invalid).
	 *
	 * @return List of all DisplayBannerDto objects.
	 */
	@Override
	public List<DisplayBannerDto> getAllBanners() {
		List<DisplayBanner> allBanners = displayBannerRepository.findAll();

		return allBanners.stream().map(displayBannerMapper::toDisplayBannerDto).toList();
	}

	/**
	 * Adds a new display banner.
	 *
	 * @param displayBannerDto DTO containing the details of the banner to be added.
	 * @return The saved DisplayBannerDto object.
	 */
	@Override
	public DisplayBannerDto addBanner(DisplayBannerDto displayBannerDto) {
		try {
			DisplayBanner displayBanner = displayBannerMapper.toDisplayBanner(displayBannerDto);
			return displayBannerMapper.toDisplayBannerDto(displayBannerRepository.save(displayBanner));
		} catch (DataIntegrityViolationException e) {
			// If it throws any unique key constraint violation error then we are maintaining our own exception
			throw new RecordAlreadyExistsException(ErrorMessage.BANNER_EXISTS.getMessage());
		}
	}

	/**
	 * Updates an existing display banner.
	 *
	 * @param displayBannerDto DTO containing the updated details of the banner.
	 * @return The updated DisplayBannerDto object.
	 */
	@Override
	public DisplayBannerDto editBanner(DisplayBannerDto displayBannerDto) {
		
		Optional<DisplayBanner> existingDisplayBanner = displayBannerRepository.findById(displayBannerDto.bannerId());
		
		if(existingDisplayBanner.isEmpty()) {
			throw new RecordNotFoundException(ErrorMessage.BANNER_NOT_FOUND.getMessage());
		}
		
		DisplayBanner editedDisplayBanner=displayBannerMapper.toDisplayBanner(displayBannerDto);
		
		return displayBannerMapper.toDisplayBannerDto(displayBannerRepository.save(editedDisplayBanner));
	}

	/**
	 * Deletes a display banner by its ID.
	 *
	 * @param displayBannerId The ID of the banner to be deleted.
	 */
	@Override
	public void deleteBanner(long displayBannerId) {
		displayBannerRepository.deleteById(displayBannerId);
	}

}
