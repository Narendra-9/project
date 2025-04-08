package com.endava.endavastrength.mapper;

import java.util.List;

import org.springframework.stereotype.Component;

import com.endava.endavastrength.dtos.ProductCardDisplayDto;
import com.endava.endavastrength.dtos.ProductDto;
import com.endava.endavastrength.entities.Image;
import com.endava.endavastrength.entities.Product;

import lombok.RequiredArgsConstructor;

@Component
@RequiredArgsConstructor
public class ProductMapper {
		
	 /**
     * Converts a Product entity to a ProductCardDisplayDto.
     * 
     * @param product the Product entity to be converted
     * @return the corresponding ProductCardDisplayDto
     */
	public ProductCardDisplayDto toProductCardDisplayDto(Product product) {
		
		Image primaryImage=product.getListOfImages().stream()
													.filter(Image::isPrimary)
													.findFirst()
													.orElse(null); 
		
		String primaryImageUrl = (primaryImage != null) ? primaryImage.getUrl() : null;
		 
		return new ProductCardDisplayDto(product.getProductId(), product.getProductName(), product.getSlug(),
				product.getBasePrice(),
				product.getDiscountedPrice(),
				product.getStockQuantity(), primaryImageUrl,
				product.getAvgRating());
	}
	
	
    /**
     * Converts a ProductDto to a Product entity.
     * 
     * @param productDto the ProductDto to be converted
     * @return the corresponding Product entity
     */
	public Product toProduct(ProductDto productDto) {
		
        long basePrice = productDto.basePrice();
        long discountedPrice = productDto.discountedPrice();
        int stockQuantity = productDto.stockQuantity();
            
		Product product=Product.builder()
							   .productName(productDto.productName())
							   .basePrice(basePrice)
							   .discountedPrice(discountedPrice)
							   .description(productDto.description())
							   .stockQuantity(stockQuantity)
							   .build();
		
		List<Image> listOfImages = productDto.listOfImageURLs().stream()
			    .map(i -> {
			        Image image = new Image();
			        image.setUrl(i);
			        image.setProduct(product);
			        image.setPrimary(productDto.primaryImg().equals(i));
			        return image;
			    })
			    .toList();
		
		product.setListOfImages(listOfImages);
		
		return product;
	}
	

	
}
