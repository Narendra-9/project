package com.endava.endavastrength.mapper;

import org.springframework.stereotype.Component;

import com.endava.endavastrength.dtos.DisplayBannerDto;
import com.endava.endavastrength.entities.DisplayBanner;

@Component
public class DisplayBannerMapper {
	
	public DisplayBanner toDisplayBanner(DisplayBannerDto displayBannerDto) {
		return DisplayBanner.builder()
							.bannerId(displayBannerDto.bannerId())
							.bannerImgUrl(displayBannerDto.bannerImgUrl())
							.takeToUrl(displayBannerDto.takeToUrl())
							.validity(displayBannerDto.validity())
							.build();
	}
	
	
	public DisplayBannerDto toDisplayBannerDto(DisplayBanner displayBanner) {

		return new DisplayBannerDto(
				displayBanner.getBannerId(),
				displayBanner.getBannerImgUrl(),
				displayBanner.getValidity(),
				displayBanner.getTakeToUrl());
	}
}
