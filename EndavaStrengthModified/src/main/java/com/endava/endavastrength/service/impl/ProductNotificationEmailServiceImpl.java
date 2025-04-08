package com.endava.endavastrength.service.impl;

import java.io.File;
import java.io.IOException;
import java.io.InputStream;
import java.nio.charset.StandardCharsets;
import java.util.Map;
import java.util.Objects;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;

import com.endava.endavastrength.service.ProductNotificationEmailService;

import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

/**
 * Service implementation for sending product back-in-stock notification emails.
 */
@Slf4j
@Service
@RequiredArgsConstructor
public class ProductNotificationEmailServiceImpl implements ProductNotificationEmailService {
    
    private final JavaMailSender javaMailSender;

    @Value("${logo.path}")
    private String logoPath;
    
    /**
     * Sends an email notification to a user when a product is back in stock.
     * The email template is loaded, placeholders are replaced, and the email is sent asynchronously.
     *
     * @param toEmail       Recipient's email address
     * @param userName      Recipient's name
     * @param productName   Name of the product that is back in stock
     * @param productImgUrl URL of the product image
     * @param slug          Product slug (used in the product URL)
     * @throws MessagingException If an error occurs while sending the email
     */
    @Async
    @Override
    public void sendMailToUser(String toEmail, String userName, String productName, String productImgUrl, String slug) throws MessagingException {
        log.info("Sending Product Back in Stock Mail to {}", toEmail);
        long startTime = System.currentTimeMillis();

        // Loading email template
        String emailContent = loadEmailTemplate();
        if (emailContent == null) {
            log.error("Email template could not be loaded.");
            return;
        }

        // Replacing placeholders with actual values
        emailContent = replacePlaceholders(emailContent, Map.of(
            "username", userName,
            "productName", productName,
            "productImgUrl", productImgUrl,
            "slug", slug
        ));

        MimeMessage message = javaMailSender.createMimeMessage();
        MimeMessageHelper helper = new MimeMessageHelper(message, true);
        helper.setTo(toEmail);
        helper.setSubject("Back in Stock: Get It Before It Sells Out!");
        helper.setText(emailContent, true);

        // Attaching logo image
        File logo = new File(logoPath);
        helper.addInline("companyLogo", logo);

        javaMailSender.send(message);
        long duration = System.currentTimeMillis() - startTime;
        log.info("Product Back in Stock Mail Sent to {} in {} ms", toEmail, duration);
    }

    /**
     * Loads the email template from the resources folder.
     *
     * @return The email template content as a string, or null if an error occurs
     */
    private String loadEmailTemplate() {
        try (InputStream inputStream = Objects.requireNonNull(
                getClass().getResourceAsStream("/templates/product-back-in-stock-template.html"))) {

            return new String(inputStream.readAllBytes(), StandardCharsets.UTF_8);

        } catch (IOException | NullPointerException e) {
            log.error("Error loading email template", e);
            return null;
        }
    }
    
    
    /**
     * Replaces placeholders in the email template with actual values.
     * Placeholders in the format ${key} are replaced with corresponding values from the provided map.
     *
     * @param template The email template containing placeholders
     * @param values   The key-value pairs to replace placeholders
     * @return The processed email content with replaced values
     */
    private String replacePlaceholders(String template, Map<String, String> values) {
        for (Map.Entry<String, String> entry : values.entrySet()) {
            template = template.replace("${" + entry.getKey() + "}", entry.getValue());
        }
        return template;
    }
}
