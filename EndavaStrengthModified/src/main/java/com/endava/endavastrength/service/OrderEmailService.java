package com.endava.endavastrength.service;

import com.endava.endavastrength.entities.Orders;

import jakarta.mail.MessagingException;

public interface OrderEmailService {
	
    public void sendOrderSummary(String toEmail,Orders order) throws MessagingException;
    
    public void sendOrderFailureEmail(String toEmail, Orders order) throws MessagingException;
    
    public String generateOrderSummaryHtml(Orders order); 
    
    public String generateOrderFailureHtml(Orders order);
}
