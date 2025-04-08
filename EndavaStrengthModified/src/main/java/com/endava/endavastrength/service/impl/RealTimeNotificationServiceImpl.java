package com.endava.endavastrength.service.impl;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.Map;

import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;

import com.endava.endavastrength.dtos.RealTimeNotification;
import com.endava.endavastrength.service.RealTimeNotificationService;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class RealTimeNotificationServiceImpl implements RealTimeNotificationService{
	
	private final SimpMessagingTemplate messagingTemplate;

	@Override
	public void sendNotification(Map<String, String> message) {
        String timestamp = LocalDateTime.now().format(DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss"));
        RealTimeNotification realTimeNotification=new RealTimeNotification(message, timestamp);
        messagingTemplate.convertAndSend("/topic/admin", realTimeNotification);		
	}

}
