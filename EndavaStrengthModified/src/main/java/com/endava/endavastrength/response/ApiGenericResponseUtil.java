package com.endava.endavastrength.response;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

import com.endava.endavastrength.enums.ErrorMessage;

/**
 * Utility class for building Generic API responses.
 * Provides methods to create success and error responses with custom HTTP status codes.
 */
public class ApiGenericResponseUtil {
	
	
    // Private constructor to prevent instantiation
    private ApiGenericResponseUtil() {
        throw new UnsupportedOperationException(ErrorMessage.CANNOT_INSTANTIATED.getMessage());
    }
	
    /**
     * Creates a success response with the given body, message, and HTTP status code.
     *
     * @param body    the body of the response, usually the result of the operation
     * @param message the success message to include in the response
     * @param status  the HTTP status code for the response
     * @return ResponseEntity<ApiGenericResponse> with the provided details
     */
	public static ResponseEntity<ApiGenericResponse> createSuccessResponse(Object body, String message, HttpStatus status) {
        return ResponseEntity.status(status)
                .body(ApiGenericResponse.builder()
                    .statusMessage(message)
                    .body(body)
                    .build()
                );
    }
	
	
    /**
     * Creates an error response with the given error message and HTTP status code.
     *
     * @param errorMessage the error message to include in the response
     * @param status       the HTTP status code for the response
     * @return ResponseEntity<ApiGenericResponse> with the provided error details
     */
    public static ResponseEntity<ApiGenericResponse> createErrorResponse(String errorMessage,HttpStatus status) {
        return ResponseEntity.status(status)
                .body(ApiGenericResponse.builder()
                    .statusMessage("Request failed")
                    .errorMessage(errorMessage)
                    .build()
                );
    }
}
