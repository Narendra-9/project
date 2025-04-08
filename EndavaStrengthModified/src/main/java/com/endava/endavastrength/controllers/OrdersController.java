package com.endava.endavastrength.controllers;

import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.endava.endavastrength.dtos.OrdersDto;
import com.endava.endavastrength.dtos.OrdersResponseDto;
import com.endava.endavastrength.enums.StatusMessage;
import com.endava.endavastrength.response.ApiGenericResponse;
import com.endava.endavastrength.response.ApiGenericResponseUtil;
import com.endava.endavastrength.response.PagedResponse;
import com.endava.endavastrength.service.OrderService;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("orders")
@RequiredArgsConstructor
public class OrdersController {
	
	private final OrderService orderService;
	
	@PostMapping
	public ResponseEntity<ApiGenericResponse> createOrder(@RequestBody OrdersDto orderDto) {
		OrdersResponseDto order=orderService.createOrder(orderDto);
		
		return ApiGenericResponseUtil.createSuccessResponse(order,
				StatusMessage.ORDER_CREATED.getMessage(),
				HttpStatus.CREATED);
	}
	
	@GetMapping("user")
	public ResponseEntity<ApiGenericResponse> getAllOrders(@RequestParam int userId,Pageable pageable){
		PagedResponse<OrdersResponseDto> listOfOrders=orderService.getAllOrdersByUserId(userId,pageable);
		
		return ApiGenericResponseUtil.createSuccessResponse(listOfOrders,
				StatusMessage.USER_ORDERS_FETCHED.getMessage(),
				HttpStatus.OK);
	}
	
	@GetMapping
	public ResponseEntity<ApiGenericResponse> getAllPlacedOrders(Pageable pageable){
		PagedResponse<OrdersResponseDto> listOfAllPlacedOrders=orderService.getAllOrders(pageable);
		
		return ApiGenericResponseUtil.createSuccessResponse(listOfAllPlacedOrders,
				StatusMessage.PLACED_ORDERS_FETCHED.getMessage(),
				HttpStatus.OK);
	}
	
	@GetMapping("/totalSpentByUser")
	public ResponseEntity<ApiGenericResponse> getTotalAmountSpentByUser(@RequestParam long userId){
		
		long totalAmountSpent=orderService.getTotalSpentByUser(userId);
		
		return ApiGenericResponseUtil.createSuccessResponse(totalAmountSpent,
				StatusMessage.TOTAL_SPENT_BY_USER_FETCHED.getMessage(),
				HttpStatus.OK);
	}
	
}
