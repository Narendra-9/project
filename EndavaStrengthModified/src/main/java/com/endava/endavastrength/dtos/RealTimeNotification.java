package com.endava.endavastrength.dtos;

import java.util.Map;

public record RealTimeNotification(Map<String, String> message,String timeStamp) {
	
}
