package com.endava.endavastrength.enums;

public enum ErrorMessage {
    DELIVERY_LOCATION_NOT_AVAILABLE("Delivery location is not available."),
	OTP_RECORD_NOT_FOUND("Otp Record Not Found"),
	INVALID_OTP("Invalid OTP or OTP Expired"),
	PRODUCT_OUT_OF_STOCK("Product out of Stock"),
	PRODUCT_NOT_IN_CART("Product not in Cart"),
	CARD_ALREADY_PRESENT("Card Already Exists"),
	CARD_NOT_FOUND("Card not Found"),
	UPIID_ALREADY_PRESET("UPI ID Already Exists"),
	SAVED_UPI_NOT_FOUND("Saved UPI not found"),
	CANNOT_INSTANTIATED("Utility class should not be instantiated"),
	USER_NOT_FOUND("User not found"),
	SUB_CATEGORY_NOT_FOUND("Sub Category Not Found"),
	WISHLIST_ITEM_PRESENT("Wish List Item Already Present"),
	WISHLIST_ITEM_NOT_FOUND("Wish List Item Not Found"),
	CART_ITEM_EXISTS("Cart Item Already Present"),
	USER_ADDRESS_NOT_FOUND("User Address Not Found"),
	ERROR_DECRYPTING_CARD("Error decrypting card details"),
	ERROR_ENCRYPTING_CARD("Error encrypting card details"),
	ERROR_DECRYPTING_UPI("Error decrypting UPI ID"),
	ERROR_ENCRYPTING_UPI("Error encrypting UPI ID"),
	PRODUCT_EXISTS("Product Already Exists"),
	PRODUCT_NOT_EXISTS("Product Not Exists"),
	INSUFFICIENT_STOCK_FOR_PRODUCT("Insufficient stock for product: "),
	ORDER_NOT_FOUND("Order Not Found"),
	ORDER_STATE_NOT_VALID("Order is not in a valid state for payment."),
	PAYMENT_SESSION_EXPIRED("Payment session has expired. Please create a new order."),
	PRODUCT_NOTIFY_ALREADY_EXISTS("Product Notification Already Exists"),
	PRODUCT_NOT_FOUND("Product Not Found"),
	PREMIUM_EXISTS_IN_CART("Premium Already Exists in Cart"),
	PREMIUM_ACTIVE("Active MemberShip Exists Already"),
	DELIVEY_LOCATION_EXISTS("Delivery Location Already Exists"),
	BANNER_EXISTS("Display Banner Already Exists"),
	BANNER_NOT_FOUND("Display Banner Not Found"),
	EMAIL_ERROR("Error Sending Mail"),
	REVIEW_NOT_FOUND("Review Not Found"),
	NOT_ORDERED("You need to order the product to post review."),
	REVIEW_NOT_EXISITS("Review Not exists"),
	CATEGORY_NOT_FOUND("Category Not Found"),
	ADDRESS_AND_USER_NOT_LINKED("Address_Id and User_Id are not linked ");


    private final String message;


    ErrorMessage(String message) {
        this.message = message;
    }


    public String getMessage() {
        return message;
    }
}
