package com.endava.endavastrength.service;

import jakarta.mail.MessagingException;

public interface ProductNotificationEmailService {
	
	void sendMailToUser(String toEmail,String userName,String productName, String productImgUrl, String slug ) throws MessagingException;
}
