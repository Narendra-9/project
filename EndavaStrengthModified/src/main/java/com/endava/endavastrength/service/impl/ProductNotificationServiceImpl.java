package com.endava.endavastrength.service.impl;

import java.util.List;
import java.util.Optional;

import org.springframework.stereotype.Service;

import com.endava.endavastrength.dtos.ProductNotificationDto;
import com.endava.endavastrength.entities.Product;
import com.endava.endavastrength.entities.ProductNotification;
import com.endava.endavastrength.entities.Users;
import com.endava.endavastrength.enums.ErrorMessage;
import com.endava.endavastrength.exceptions.EmailSendingException;
import com.endava.endavastrength.exceptions.RecordAlreadyExistsException;
import com.endava.endavastrength.exceptions.RecordNotFoundException;
import com.endava.endavastrength.mapper.ProductNotificationMapper;
import com.endava.endavastrength.repositories.ProductNotificationRepository;
import com.endava.endavastrength.repositories.ProductRepository;
import com.endava.endavastrength.service.ProductNotificationEmailService;
import com.endava.endavastrength.service.ProductNotificationService;
import com.endava.endavastrength.service.UsersService;

import jakarta.mail.MessagingException;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Slf4j
@Service
@RequiredArgsConstructor
public class ProductNotificationServiceImpl implements ProductNotificationService{
	
	
	private final ProductNotificationRepository productNotificationRepository;
	
	private final UsersService usersService;
	
	private final ProductRepository productRepository;
	
	private final ProductNotificationEmailService productNotificationEmailService;
	
	private final ProductNotificationMapper productNotificationMapper;

	@Override
	public ProductNotificationDto addNotification(ProductNotificationDto productNotificationDto) {
		
		Optional<ProductNotification> existingProductNotification=productNotificationRepository
				.findByUser_UserIdAndProduct_ProductId(productNotificationDto.userId(), productNotificationDto.productId());
		
		// Checking If the Notification is present or not , allowing only to add if its not already present.
		if(existingProductNotification.isEmpty()) {
			// Creating new ProductNotification and setting it up.
			ProductNotification productNotification=new ProductNotification();
			productNotification.setProduct(productRepository.findById(productNotificationDto.productId())
					.orElseThrow(()->new RecordNotFoundException(ErrorMessage.PRODUCT_NOT_FOUND.getMessage())));
			
			productNotification.setUser(usersService.fetchUserDetails(productNotificationDto.userId()));
			
			// Saving it returning as DTO.
			return productNotificationMapper.toProductNotificationDto(productNotificationRepository.save(productNotification));
		}
		else {
			throw new RecordAlreadyExistsException(ErrorMessage.PRODUCT_NOTIFY_ALREADY_EXISTS.getMessage());
		}
		
	}

	@Override
	public void deleteNotification(long userId, long productId) {
		productNotificationRepository.deleteByUser_UserIdAndProduct_ProductId(userId, productId);
	}
	
	
	@Override
    public List<Users> getUsersByProductId(long productId) {
        return productNotificationRepository.findUsersByProductId(productId);
    }

	@Override
	public void notifyUsers(long productId) {
		Product product =productRepository.findById(productId)
				.orElseThrow(()-> new RecordNotFoundException(ErrorMessage.PRODUCT_NOT_FOUND.getMessage()));
		
	    List<Users> usersToNotify = productNotificationRepository.findUsersByProductId(productId);

	    for (Users user:usersToNotify) {
	    	try {
	    		log.info("Product Back in stock mail iniated for {} ",user.getUserEmail());
				productNotificationEmailService.sendMailToUser(
						user.getUserEmail(), 
						user.getUserName(), 
						product.getProductName(), 
						product.getListOfImages().get(0).getUrl(), 
						product.getSlug());
			} catch (MessagingException e) {
				
				throw new EmailSendingException(ErrorMessage.EMAIL_ERROR.getMessage());
			}
	    }
		
	}
}
