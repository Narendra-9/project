package com.endava.endavastrength.controllers;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import com.endava.endavastrength.dtos.HomePageDto;
import com.endava.endavastrength.enums.StatusMessage;
import com.endava.endavastrength.response.ApiGenericResponse;
import com.endava.endavastrength.response.ApiGenericResponseUtil;
import com.endava.endavastrength.service.HomeService;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/home")
@RequiredArgsConstructor
public class HomeController {
	
	/**
	 * Service used for fetching Home page data
	 */
	private final HomeService homeService;
	
	
    /**
     * This endpoint fetches the home page content.
     *
     * @return ResponseEntity containing the home page data and a success message
     */
	@GetMapping
	public ResponseEntity<ApiGenericResponse> getHomePageContent() {
		HomePageDto homePageDto=homeService.getHomePageData();
		
		// Using the utility class to create the success response		
		return ApiGenericResponseUtil.createSuccessResponse(homePageDto,
				StatusMessage.HOME_PAGE_CONTENT_FETCHED.getMessage(),
				HttpStatus.OK);
	}
}
