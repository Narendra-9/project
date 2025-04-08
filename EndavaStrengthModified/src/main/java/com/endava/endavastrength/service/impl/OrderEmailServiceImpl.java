package com.endava.endavastrength.service.impl;

import java.io.File;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;

import com.endava.endavastrength.entities.OrderItems;
import com.endava.endavastrength.entities.Orders;
import com.endava.endavastrength.service.OrderEmailService;

import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;


@Slf4j
@Service
@RequiredArgsConstructor
public class OrderEmailServiceImpl implements OrderEmailService{
	

    private final JavaMailSender javaMailSender;
    
    @Value("${logo.path}")
    private String logoPath;
    
    @Async
	@Override
	public void sendOrderSummary(String toEmail,Orders order) throws MessagingException {
    	log.info("Sending Order summary to {}", toEmail);
        MimeMessage message = javaMailSender.createMimeMessage();
        MimeMessageHelper helper = new MimeMessageHelper(message, true);
        String emailContent=generateOrderSummaryHtml(order);
        helper.setTo(toEmail);
        helper.setSubject("Your Order Summary");
        helper.setText(emailContent, true);


        File logo = new File(logoPath);
        helper.addInline("companyLogo", logo);

        javaMailSender.send(message);
        log.info("Order Summary Sent to {}", toEmail);
	}

	@Override
	public String generateOrderSummaryHtml(Orders order) {
		StringBuilder html = new StringBuilder();

        html.append("<html><head><style>");
        html.append("body { font-family: Arial, sans-serif; color: #333; }");
        html.append(".email-container { max-width: 600px; margin: auto; padding: 20px; color: white; background-color: #192B37; border-radius: 8px; }");
        html.append(".logo { text-align: center; margin-bottom: 20px; background-color: #192B37; border-radius: 10px }");
        html.append(".header { text-align: center; font-size: 22px; font-weight: bold; color: #4CAF50; }");
        html.append("table { width: 100%; border-collapse: collapse; margin-top: 20px; }");
        html.append("th, td { border: 1px solid #ddd; padding: 10px; text-align: left; }");
        html.append("th { background-color: #4CAF50; color: white; }");
        html.append(".footer { margin-top: 30px; text-align: center; font-size: 14px; color: #555; }");
        html.append("</style></head><body>");

        html.append("<div class='email-container'>");


        html.append("<div class='logo'><img src='cid:companyLogo' alt='Company Logo' style='height: 80px;'/></div>");


        html.append("<div class='header'>Order Summary</div>");
        html.append("<p><strong>Order ID:</strong> #").append(order.getOrderId()).append("</p>");
        html.append("<p><strong>Order Date:</strong> ").append(order.getCreatedAt()).append("</p>");
        html.append("<p><strong>Billing Address:</strong><br>")
        	.append(order.getUserAddress().getFullName())
        	.append("<br>")
        	.append(order.getUserAddress().getMobileNo())
        	.append("<br>")
        	.append(order.getUserAddress().getAddress())
        	.append("<br>")
        	.append(order.getUserAddress().getLocality())
        	.append("<br>")
        	.append(order.getUserAddress().getCity())
        	.append("<br>")
        	.append(order.getUserAddress().getPincode())
        	.append("<br>")
        	.append(order.getUserAddress().getState())
        	.append("</p>");


        html.append("<table><tr><th>Item</th><th>Quantity</th><th>Price</th><th>Total</th></tr>");

        for (OrderItems item : order.getListOfOrderItems()) {
            html.append("<tr>");
            html.append("<td>").append(item.getProduct().getProductName()).append("</td>");
            html.append("<td>").append(item.getQuantity()).append("</td>");
            html.append("<td>₹").append(item.getProduct().getDiscountedPrice()).append("</td>");
            html.append("<td>₹").append(item.getQuantity() * item.getProduct().getDiscountedPrice()).append("</td>");
            html.append("</tr>");
        }


        html.append("<tr><td colspan='3'><strong>Grand Total:</strong></td><td>₹")
            .append(order.getTotalPrice()).append("</td></tr>");
        html.append("</table>");


        html.append("<div class='footer'>");
        html.append("<p>Thank you for shopping with us!</p>");
        html.append("<p><strong>Best Regards,</strong><br><span style='color:#ff5640;font-weight:bold;'>Endava Strength</span></p>");
        html.append("</div>");

        html.append("</div></body></html>");

        return html.toString();
	}
	
	
	@Async
	@Override
	public void sendOrderFailureEmail(String toEmail, Orders order) throws MessagingException {
        try {
            MimeMessage message = javaMailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, true);
            String emailContent = generateOrderFailureHtml(order);

            helper.setTo(toEmail);
            helper.setSubject("Order Payment Failed");
            helper.setText(emailContent, true);


            File logo = new File(logoPath);
            helper.addInline("companyLogo", logo);

            javaMailSender.send(message);
            log.info("Order failure email sent successfully to {}",toEmail);
            
        } catch (Exception e) {
        	log.error("Failed to send order failure email: {}", e.getMessage());
        }
		
	}

	@Override
	public String generateOrderFailureHtml(Orders order) {
		StringBuilder html = new StringBuilder();

        html.append("<html><head><style>");
        html.append("body { font-family: Arial, sans-serif; color: #333; }");
        html.append(".email-container { max-width: 600px; margin: auto; padding: 20px; color: white; background-color: #192B37; border-radius: 8px; }");
        html.append(".logo { text-align: center; margin-bottom: 20px; }");
        html.append(".header { text-align: center; font-size: 22px; font-weight: bold; color: #D32F2F; }"); // Red color for failure
        html.append(".footer { margin-top: 30px; text-align: center; font-size: 14px; color: #555; }");
        html.append("</style></head><body>");

        html.append("<div class='email-container'>");

        // Add Logo
        html.append("<div class='logo'><img src='cid:companyLogo' alt='Company Logo' style='height: 80px;'/></div>");

        // Email Header
        html.append("<div class='header'>Payment Failed</div>");
        html.append("<p>Dear ").append(order.getUser().getUserName()).append(",</p>");
        html.append("<p>Unfortunately, your payment for <strong>Order ID: ").append(order.getOrderId()).append("</strong> has failed.</p>");

        // Order Details
        html.append("<p><strong>Order Date:</strong> ").append(order.getCreatedAt()).append("</p>");
        html.append("<p><strong>Total Amount:</strong> ₹").append(order.getTotalPrice()).append("</p>");

        html.append("<p>Please try again or use a different payment method.</p>");

        // Footer
        html.append("<div class='footer'>");
        html.append("<p>If you have any questions, feel free to contact our support team.</p>");
        html.append("<p><strong>Best Regards,</strong><br><span style='color:#ff5640;font-weight:bold;'>Endava Strength</span></p>");
        html.append("</div>");

        html.append("</div></body></html>");

        return html.toString();
	}

}
