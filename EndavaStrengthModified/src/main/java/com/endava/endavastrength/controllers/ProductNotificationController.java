package com.endava.endavastrength.controllers;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.endava.endavastrength.dtos.ProductNotificationDto;
import com.endava.endavastrength.enums.StatusMessage;
import com.endava.endavastrength.response.ApiGenericResponse;
import com.endava.endavastrength.response.ApiGenericResponseUtil;
import com.endava.endavastrength.service.ProductNotificationService;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/notify")
@RequiredArgsConstructor
public class ProductNotificationController {
	
	private final ProductNotificationService productNotificationService;
	
	
	@PostMapping(consumes = "application/json",produces = "application/json")
	public ResponseEntity<ApiGenericResponse> addNotification(@RequestBody ProductNotificationDto productNotificationDto) {
		ProductNotificationDto productNotificationDtoResponse=productNotificationService.addNotification(productNotificationDto);
		
		return ApiGenericResponseUtil.createSuccessResponse(productNotificationDtoResponse,
				StatusMessage.PRODUCT_NOTIFICATION_ADDED.getMessage(),
				HttpStatus.CREATED);
	}
}
