package com.endava.endavastrength.controllers;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.endava.endavastrength.dtos.AdminStatDto;
import com.endava.endavastrength.enums.ApiPaths;
import com.endava.endavastrength.enums.StatusMessage;
import com.endava.endavastrength.response.ApiGenericResponse;
import com.endava.endavastrength.response.ApiGenericResponseUtil;
import com.endava.endavastrength.service.AdminStatService;

import lombok.RequiredArgsConstructor;


/**
 * Controller for handling administrative statistics requests.
 * 
 * This controller provides an endpoint to fetch statistical information related to the
 * users, orders, payments, and products.
 */
@RestController
@RequestMapping(ApiPaths.ADMIN_STATS)
@RequiredArgsConstructor
public class AdminStatController {
	
    /**
     * Service for fetching administrative statistics.
     * This service is injected using constructor injection.
     */
	private final AdminStatService adminStatService;
	
	/**
     * Fetches and returns the administrative statistics.
     * 
     * This endpoint retrieves various statistics such as user count, order status counts,
     * revenue, and product information.
     * 
     * @return A ResponseEntity containing the statistical data and a success message.
     */
	@GetMapping
	public ResponseEntity<ApiGenericResponse> getAdminStat(){
		AdminStatDto adminStatDto=adminStatService.getAdminStats();
		
		// Using the utility class to create the success response		
	    return ApiGenericResponseUtil.createSuccessResponse(
	            adminStatDto, 
	            StatusMessage.ADMIN_STATS_FETCHED_SUCCESSFULLY.getMessage(), 
	            HttpStatus.OK
	        );
	}
}
