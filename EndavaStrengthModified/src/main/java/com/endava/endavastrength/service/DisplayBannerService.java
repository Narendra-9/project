package com.endava.endavastrength.service;

import java.util.List;

import com.endava.endavastrength.dtos.DisplayBannerDto;

public interface DisplayBannerService {
	
	List<DisplayBannerDto> getAllValidBanners();
	
	List<DisplayBannerDto> getAllBanners();
	
	DisplayBannerDto addBanner(DisplayBannerDto displayBannerDto);
	
	DisplayBannerDto editBanner(DisplayBannerDto displayBannerDto);
	
	void deleteBanner(long displayBannerId);
}
