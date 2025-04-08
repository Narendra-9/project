package com.endava.endavastrength.response;

import java.time.LocalDateTime;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.ToString;


/**
 * A General API response wrapper.
 * 
 * This class is used to wrap the response body, status message, and error message,
 * providing a uniform structure for API responses.
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@ToString
public class ApiGenericResponse {
	
	/**
     * The status message of the response, describing the result of the operation.
     */
	private String statusMessage;
	
    /**
     * The body of the response, which contains the data returned from the server.
     * It can be any object that the request expects.
     */
	private Object body;
	
    /**
     * The error message returned when the operation fails.
     * This can be null if the operation is successful.
     */
	private String errorMessage;
	
    /**
     * Timestamp indicating when the response was created.
     * Useful for tracking when the response was generated.
     */
	@Builder.Default
	private LocalDateTime timeStamp=LocalDateTime.now();
}
