package com.endava.endavastrength.controllers;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.endava.endavastrength.dtos.PaymentDto;
import com.endava.endavastrength.enums.StatusMessage;
import com.endava.endavastrength.response.ApiGenericResponse;
import com.endava.endavastrength.response.ApiGenericResponseUtil;
import com.endava.endavastrength.service.PaymentService;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("payment")
@RequiredArgsConstructor
public class PaymentController {
	

	private final PaymentService paymentService;
	
	@PostMapping
	public ResponseEntity<ApiGenericResponse> processPayment(@RequestBody PaymentDto paymentDto,@RequestParam boolean isSuccess){
		PaymentDto payment=paymentService.processPayment(paymentDto, isSuccess);
		
		return ApiGenericResponseUtil.createSuccessResponse(payment,
				StatusMessage.PAYMENT_PROCESSED.getMessage(),
				HttpStatus.OK);
	
	}
}
