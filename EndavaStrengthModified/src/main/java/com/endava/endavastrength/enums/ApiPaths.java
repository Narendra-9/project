package com.endava.endavastrength.enums;

public class ApiPaths {
	
    private ApiPaths() {
        throw new UnsupportedOperationException(ErrorMessage.CANNOT_INSTANTIATED.getMessage());
    }
    
	public static final String ADMIN_STATS="/adminstats";
	public static final String AUTH="/auth";
	public static final String SEND_OTP="/send-otp";
	public static final String VERIFY_OTP="/verify-otp";
	
	public static final String PRODUCTS="/products";
	public static final String SLUG="/slug";
	public static final String EDIT_PRODUCT="/editProduct";
	public static final String PRODUCTS_BY_CATEGORYID="/category/{categoryId}";
	public static final String PRODUCTS_BY_CATEGORY_NAME="/category/categoryName/{categoryName}";
	public static final String FILTER="/filter";
	public static final String NEWLY_LAUNCHED="/newlylaunched";
	public static final String LOW_STOCK="/lowStock";
	public static final String CONTAINING="/containing";
	public static final String PRODUCT_VARIANTS="/productVariant";
	public static final String PRODUCT_TOGGLE_ACTIVE="{id}/toggleActive";
	public static final String BEST_SELLING="/bestSelling";
	public static final String BEST_SELLING_OF_CATEGORY="{categoryName}/bestSelling";
	
	
}
