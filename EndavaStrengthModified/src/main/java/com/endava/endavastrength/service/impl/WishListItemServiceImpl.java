package com.endava.endavastrength.service.impl;

import java.util.List;
import java.util.Optional;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.endava.endavastrength.dtos.WishListItemDto;
import com.endava.endavastrength.dtos.WishListItemResponseDto;
import com.endava.endavastrength.entities.CartItem;
import com.endava.endavastrength.entities.Product;
import com.endava.endavastrength.entities.Users;
import com.endava.endavastrength.entities.WishListItem;
import com.endava.endavastrength.enums.ErrorMessage;
import com.endava.endavastrength.exceptions.ProductOutOfStockException;
import com.endava.endavastrength.exceptions.RecordAlreadyExistsException;
import com.endava.endavastrength.exceptions.RecordNotFoundException;
import com.endava.endavastrength.mapper.WishListItemMapper;
import com.endava.endavastrength.repositories.WishListItemRepository;
import com.endava.endavastrength.service.CartItemService;
import com.endava.endavastrength.service.ProductService;
import com.endava.endavastrength.service.UsersService;
import com.endava.endavastrength.service.WishListItemService;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class WishListItemServiceImpl implements WishListItemService{
	
	private final UsersService usersService;
	
	private final ProductService productService;
	
	private final WishListItemMapper wishListItemMapper;
	
	private final WishListItemRepository wishListItemRepository;
	
	private final CartItemService cartItemService;
	
	
	@Override
	@Transactional
	public WishListItemResponseDto addWishListItem(WishListItemDto wishListItemDto){
		
		Users user=usersService.fetchUserDetails(wishListItemDto.userId());
		Product product=productService.findProductById(wishListItemDto.productId());
		WishListItem wishListItem= WishListItem.builder()
											   .user(user)
											   .product(product)
											   .build();
		Optional<WishListItem> existingItem=wishListItemRepository.findByUserAndProduct(wishListItem.getUser(), wishListItem.getProduct());
		if(existingItem.isEmpty()) {
			return  wishListItemMapper.toWishListItemResponseDto(wishListItemRepository.save(wishListItem));
		}
		else {
			throw new RecordAlreadyExistsException(ErrorMessage.WISHLIST_ITEM_PRESENT.getMessage());
		}
	}

	@Override
	public void deleteFromWishList(long wishListItemId) {
		wishListItemRepository.deleteById(wishListItemId);
	}

	@Override
	public List<WishListItemResponseDto> findWishList(long userId) {
		List<WishListItem> wishListItems= wishListItemRepository.findByUser_UserId(userId);
		return wishListItems.stream().map(wishListItemMapper::toWishListItemResponseDto).toList();
	}
	
	
	@Override
	@Transactional
	public void moveWishListItemToCart(WishListItemDto wishListItemDto) {
		
		Product product=productService.findProductById(wishListItemDto.productId());
		if(product.getStockQuantity()==0) {
			throw new ProductOutOfStockException(ErrorMessage.PRODUCT_OUT_OF_STOCK.getMessage());
		}
		Users user=usersService.fetchUserDetails(wishListItemDto.userId());
		
		WishListItem wishListItem= WishListItem.builder()
											   .user(user)
											   .product(product)
											   .build();
		Optional<WishListItem> existingItemRecord=wishListItemRepository.findByUserAndProduct(wishListItem.getUser(), wishListItem.getProduct());
		if(existingItemRecord.isPresent()) {
			WishListItem existingItem=existingItemRecord.get();
			Optional<CartItem> cartItem=cartItemService.findByCartAndProduct(existingItem.getUser().getCart(), existingItem.getProduct());
			if(cartItem.isEmpty()) {
				CartItem newCartItem=new CartItem();
				newCartItem.setCart(existingItem.getUser().getCart());
				newCartItem.setProduct(existingItem.getProduct());
				newCartItem.setQuantity(1);
				cartItemService.addCartItem(newCartItem);
				wishListItemRepository.delete(existingItem);
			}
			else {
				throw new RecordAlreadyExistsException(ErrorMessage.CART_ITEM_EXISTS.getMessage());
			}
		}
		else {
			throw new RecordNotFoundException(ErrorMessage.WISHLIST_ITEM_NOT_FOUND.getMessage());
		}
	}


}
