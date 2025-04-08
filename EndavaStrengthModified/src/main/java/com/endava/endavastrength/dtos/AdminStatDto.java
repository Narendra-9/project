package com.endava.endavastrength.dtos;

public record AdminStatDto(long totalUsers, long newRegistrations, long totalOrders, long pendingOrders,
		long processedOrders, long canceledOrders, long totalRevenue, long todayRevenue, long totalPaymentsProcessed,
		long failedPayments, long totalProducts, long lowStockProducts) {
}
