package com.endava.endavastrength.enums;

public enum Url {
	CORS_URL("http://localhost:3000");
	
    private final String message;


	Url(String message) {
        this.message = message;
    }


    public String getMessage() {
        return message;
    }
}
