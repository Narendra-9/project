package com.endava.endavastrength.exceptions;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import com.endava.endavastrength.response.ApiGenericResponse;
import com.endava.endavastrength.response.ApiGenericResponseUtil;

@RestControllerAdvice
public class EndavaStrengthExceptionHandler {
	

	@ExceptionHandler(exception = DeliveryLocationNotFoundException.class)
	public ResponseEntity<ApiGenericResponse> handleTicketNotFoundException(DeliveryLocationNotFoundException exception){		
		return ApiGenericResponseUtil.createErrorResponse(exception.getMessage(), HttpStatus.NOT_FOUND);
	}
	
	@ExceptionHandler(exception = OtpRecordNotFoundException.class)
	public ResponseEntity<ApiGenericResponse> handleOtpRecordNotFoundException(OtpRecordNotFoundException exception){
		return ApiGenericResponseUtil.createErrorResponse(exception.getMessage(), HttpStatus.NOT_FOUND);
	}
	
	
	
	@ExceptionHandler(exception = UserNotFoundException.class)
	public ResponseEntity<ApiGenericResponse> handleUserNotFoundException(UserNotFoundException exception){
		return ApiGenericResponseUtil.createErrorResponse(exception.getMessage(), HttpStatus.NOT_FOUND);
	}
	
	@ExceptionHandler(exception = ProductOutOfStockException.class)
	public ResponseEntity<ApiGenericResponse> handleProductOutOfStockException(ProductOutOfStockException exception){
		return ApiGenericResponseUtil.createErrorResponse(exception.getMessage(), HttpStatus.NOT_FOUND);
	}
	
	
	
	@ExceptionHandler(exception = ProductNotInCartException.class)
	public ResponseEntity<ApiGenericResponse> handleProductNotInCartException(ProductNotInCartException exception){
		return ApiGenericResponseUtil.createErrorResponse(exception.getMessage(), HttpStatus.NOT_FOUND);
	}
	
	
	@ExceptionHandler(exception = RecordNotFoundException.class)
	public ResponseEntity<ApiGenericResponse> handleRecordNotFoundException(RecordNotFoundException exception){
		return ApiGenericResponseUtil.createErrorResponse(exception.getMessage(), HttpStatus.NOT_FOUND);

	}
	
	
	
	@ExceptionHandler(exception = RecordAlreadyExistsException.class)
	public ResponseEntity<ApiGenericResponse> handleRecordAlreadyExistsException(RecordAlreadyExistsException exception){
		return ApiGenericResponseUtil.createErrorResponse(exception.getMessage(), HttpStatus.valueOf(409));

	}
	
	
	@ExceptionHandler(exception = InvalidOrderStateException.class)
	public ResponseEntity<ApiGenericResponse> handleInvalidOrderStateException(InvalidOrderStateException exception){
		return ApiGenericResponseUtil.createErrorResponse(exception.getMessage(), HttpStatus.valueOf(409));

	}
	
	
	@ExceptionHandler(exception = InvalidOTPException.class)
	public ResponseEntity<ApiGenericResponse> handleInvalidOTPException(InvalidOTPException exception){
		return ApiGenericResponseUtil.createErrorResponse(exception.getMessage(), HttpStatus.BAD_REQUEST);
	}
	
	@ExceptionHandler(exception = CardEncryptionException.class)
	public ResponseEntity<ApiGenericResponse> handleCardEncryptionException(CardEncryptionException exception){
		return ApiGenericResponseUtil.createErrorResponse(exception.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
	}
	
	@ExceptionHandler(exception = OperationNotAllowed.class)
	public ResponseEntity<ApiGenericResponse> handleOperationNotAllowed(OperationNotAllowed exception){
		return ApiGenericResponseUtil.createErrorResponse(exception.getMessage(), HttpStatus.BAD_REQUEST);
	}
	
	@ExceptionHandler(exception = StillPremiumActiveException.class)
	public ResponseEntity<ApiGenericResponse> handleStillPremiumActiveException(StillPremiumActiveException exception){
		return ApiGenericResponseUtil.createErrorResponse(exception.getMessage(), HttpStatus.CONFLICT);
	}
	
	@ExceptionHandler(exception = EmailSendingException.class)
	public ResponseEntity<ApiGenericResponse> handleEmailSendingException(EmailSendingException exception){
		return ApiGenericResponseUtil.createErrorResponse(exception.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
	}
	
	@ExceptionHandler(exception = AddressNotLinkedToUserException.class)
	public ResponseEntity<ApiGenericResponse> handleAddressNotLinkedToUserException(AddressNotLinkedToUserException exception) {
	    return ApiGenericResponseUtil.createErrorResponse(exception.getMessage(), HttpStatus.BAD_REQUEST);
	}
	
	@ExceptionHandler(exception = Exception.class)
	public ResponseEntity<ApiGenericResponse> handleGenericException(Exception exception) {
	    return ApiGenericResponseUtil.createErrorResponse(exception.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
	}
	
}
