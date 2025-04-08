package com.endava.endavastrength.exceptions;

public class OtpRecordNotFoundException extends RuntimeException{


	private static final long serialVersionUID = 1L;

	public OtpRecordNotFoundException() {
		super();

	}

	public OtpRecordNotFoundException(String message, Throwable cause, boolean enableSuppression, boolean writableStackTrace) {
		super(message, cause, enableSuppression, writableStackTrace);

	}

	public OtpRecordNotFoundException(String message, Throwable cause) {
		super(message, cause);

	}

	public OtpRecordNotFoundException(String message) {
		super(message);

	}

	public OtpRecordNotFoundException(Throwable cause) {
		super(cause);

	}
	
}
