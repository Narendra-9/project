package com.endava.endavastrength.dtos;

import java.time.LocalDate;

public record DisplayBannerDto(

		long bannerId,

		String bannerImgUrl,

		LocalDate validity,

		String takeToUrl) {}
