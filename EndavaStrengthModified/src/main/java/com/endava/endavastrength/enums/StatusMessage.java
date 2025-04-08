package com.endava.endavastrength.enums;


public enum StatusMessage {
	ADMIN_STATS_FETCHED_SUCCESSFULLY("Admin Stats Fetched Successfully"),
	LOGIN_SUCCESSFULL("Login Successful"),
	OTP_SENT_SUCCESSFULLY("OTP Sent Successfully"),
	FETCHED_CART_SUCCESSFULLY("Fetched Cart Successfully"),
	ADDED_TO_CART("Addeed to Cart Successfully"),
	DELETED_FROM_CART("Deleted From Cart Successfully"),
	MOVED_TO_WISHLIST("Successfully Moved to WishList"),
	DELIVERY_LOCATION_ADDED("Delivery Location added Successfully"),
	EXPECTED_DELIVERY_FETCHED("Expected Delivery Fetched Successfully"),
	FETCHED_ALL_DELIVERY_LOCATIONS("Fetched All Delivery Locations Successfully"),
	FETCHED_ALL_VALID_BANNERS("Fetched All Valid Banners Successfully"),
	FETCHED_ALL_BANNERS("Fetched All Banners"),
	BANNER_ADDED("Banner Added Successfully"),
	BANNER_EDITED("Banner Edited Successfully"),
	BANNER_DELETED("Banner Deleted Successfully"),
	PRODUCT_ADDED("Product Added Successfully"),
	PRODUCT_EDITED("Product Edited Successfully"),
	FETCHED_ALL_PRODUCTS("Fetched All Products Successfully"),
	FETCHED_CATEGORY_PRODUCTS("Fetched Products of Category"),
	FETCHED_NEWLY_LAUNCHED("Fetched Newly Launched Products"),
	FETCHED_SEARCHED_KEYWORD("Fetched Searched Keyword"),
	FETCHED_LOW_STOCK_PRODUCTS("Fetched Low Stock Products"),
	FETCHED_PRODUCT("Fetched Product Successfulyy"),
	FETCHED_PRODUCT_VARIENTS("Fetched Product Varients Successfully"),
	DISCONTINUE_PRODUCT("Product Discotinued Successfully"),
	CARD_ADDED("Card Added Successfully"),
	FETCHED_SAVED_CARDS("Fetched Saved Cards"),
	RETRIEVED_SAVED_CARD("Retrieved the user's saved card."),
	CARD_DELETED("Card Deleted Successdully"),
	UPI_SAVED("UPI ID Saved Successfully"),
	USER_UPI_FETCHED("User's UPID(s) fetched Successfully"),
	UPI_DELETED("UPI ID Delted Successdully"),
	FETCHED_USER_ADDRESSES("Successfully fetched User Addresses"),
	ADDRESS_ADDED("Successfully added Address"),
	ADDRESS_EDITED("User Address Updated Successfully"),
	ADDRESS_DELETED("User Adrress Deleted Successfully"),
	CATEGORY_ADDED("Category Added Successfully"),
	CATGEORIES_WITH_SUBCATEGORIES("Fetched Categories with SubCategories Successfully"),
	CATGEORY_WITHOUT_SUBCATEGORIES("Fetched Category without SubCategory Successfully"),
	CATGEORIES_WITHOUT_SUBCATEGORIES("Fetched Categories without SubCategories Successfully"),
	CATEGORY_DELETED("Category Deleted Successfully"),
	SUBCATEGORY_WITH_PRODUCTS("Fetched SubCategory with Products Successfully"),
	SUBCATEGORY_ADDED("Sub Category Added Successfully"),
	SUBCATEGORY_DELETED("Sub Category Deleted"),
	WISHLIST_FETCHED("WishList Fetched Successfully"),
	WISHLIST_ITEM_ADDED("Item Added to WishList Successfully"),
	WISHLIST_ITEM_DELETED("WishList Item Deleted Successfully"),
	MOVED_TO_CART("Item Moved to Cart Successfully"),
	HOME_PAGE_CONTENT_FETCHED("Successfully fetched Home Page Content"),
	ORDER_CREATED("Order Created Successfully"),
	USER_ORDERS_FETCHED("Orders Fetched Successfully"),
	PLACED_ORDERS_FETCHED("Placed Orders Fetched Successfully"),
	PAYMENT_PROCESSED("Payment Processed, Check for status"),
	LOGOUT_SUCCESSFULLY("Logged out Successfully"),
	EDITED_USER("User Edited Successfully"),
	FETCHED_ALL_USERS("All Users fetched Successfully"),
	TOGGLE_USER_ACTIVE("Toggled User Active"),
	INSUFFICIENT_STOCK_FOR_PRODUCT("Insufficient stock for product: "),
	PRODUCT_NOTIFICATION_ADDED("Product Notification Added"),
	TOTAL_SPENT_BY_USER_FETCHED("Fetched Total Amount Spent By User"),
	REVIEW_POSTED("Review Posted Succesfully"),
	REVIEW_EDITED("Review Edited Successfully"),
	REVIEW_DELETED("Review Deleted Successfully"),
	USER_REVIEWS_FETCHED("User Reviews Fetched Succesfully"),
	REVIEW_FETCHED("User Review Fetched Succesfully.");
	
	private final String message;

	StatusMessage(String message) {
		this.message = message;
	}
	
	public String getMessage() {
        return message;
    }
}
