package com.endava.endavastrength.service.impl;

import java.time.LocalDateTime;

import org.springframework.stereotype.Service;

import com.endava.endavastrength.dtos.AdminStatDto;
import com.endava.endavastrength.enums.OrderStatus;
import com.endava.endavastrength.repositories.OrdersRepository;
import com.endava.endavastrength.repositories.PaymentRepository;
import com.endava.endavastrength.repositories.ProductRepository;
import com.endava.endavastrength.repositories.UsersRepository;
import com.endava.endavastrength.service.AdminStatService;

import lombok.RequiredArgsConstructor;

/**
 * Service implementation for managing administrative statistics in the system.
 * 
 * This service provides various statistics such as the number of users, total orders,
 * revenue information, and product stock status.
 */
@Service
@RequiredArgsConstructor
public class AdminStatServiceImpl implements AdminStatService {

    /**
     * Repository for accessing user data.
     */
    private final UsersRepository userRepository;

    /**
     * Repository for accessing order data.
     */
    private final OrdersRepository orderRepository;

    /**
     * Repository for accessing payment data.
     */
    private final PaymentRepository paymentRepository;

    /**
     * Repository for accessing product data.
     */
    private final ProductRepository productRepository;

    /**
     * Retrieves administrative statistics including user counts, order counts, revenue, 
     * and product information.
     *
     * @return {AdminStatDto} containing the various statistics.
     */    
    @Override
    public AdminStatDto getAdminStats() {
        return new AdminStatDto(
            userRepository.count(),
            userRepository.countNewRegistrations(),
            orderRepository.count(),
            orderRepository.countByOrderStatus(OrderStatus.PENDING),
            orderRepository.countByOrderStatus(OrderStatus.PLACED),
            orderRepository.countByOrderStatus(OrderStatus.CANCELED),
            paymentRepository.calculateTotalRevenue(),
            getTodayRevenue(),
            paymentRepository.countTotalPayments(),
            paymentRepository.countFailedPayments(),
            productRepository.count(),
            productRepository.countLowStockProducts(5)
        );
    }


    /**
     * Calculates the total revenue for the current day.
     * 
     * This method calculates revenue based on payments made today, starting from midnight
     * and ending just before the next day begins.
     * 
     * @return the total revenue for today.
     */
    private long getTodayRevenue() {
        // Get the start of the current day (midnight)
        LocalDateTime startOfDay = LocalDateTime.now().toLocalDate().atStartOfDay();
        // Get the end of the current day (just before midnight of the next day)
        LocalDateTime endOfDay = startOfDay.plusDays(1).minusNanos(1);
        
        // Calculate and return the revenue for the current day
        return paymentRepository.calculateTodayRevenue(startOfDay, endOfDay);
    }
}
