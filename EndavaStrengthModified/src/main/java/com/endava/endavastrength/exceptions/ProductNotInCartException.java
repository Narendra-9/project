package com.endava.endavastrength.exceptions;

public class ProductNotInCartException extends RuntimeException{

	private static final long serialVersionUID = 1L;

	public ProductNotInCartException(String message) {
		super(message);

	}

	
}
