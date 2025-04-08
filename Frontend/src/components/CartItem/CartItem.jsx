import React, { useContext, useState } from 'react'
import {ReactComponent as DeleteIcon} from "../../assets/trash.svg"
import CartPageExpectedDelivery from '../CartPageExpectedDelivery/CartPageExpectedDelivery.jsx';
import { useNavigate } from 'react-router-dom';
import "./CartItem.css"
import { CartContext } from '../../context/CartContext.jsx';
import Swal from 'sweetalert2'
import { ThemeContext } from '../../context/ThemeContext.jsx';

function CartItem({item}) {
    const {deleteFromCart,addToCart,moveToWishList,earnRate}=useContext(CartContext);
    const {isPremium}=useContext(ThemeContext)
    let [quantity,setQuantity]=useState(item?.quantity);
    let productNameSplittedArray=item?.product?.productName.split(",");
    let productName=productNameSplittedArray[0];
    let productWeight=productNameSplittedArray[1];
    let productFlavour=productNameSplittedArray[2];
    let navigate=useNavigate();
    let stockQuantity=item?.product?.stockQuantity;

    function takeToProductPage(slug){
        navigate(`/products/${slug}`)
    }

    function handleQuantiyDecrement(e){
        e.stopPropagation();
        if(quantity>1){
            setQuantity(prev=>prev-1)
            addToCart(item?.product?.productId,-1);
        }
        if(quantity===1){
            deleteFromCart(item?.product?.productId);
        }
    }

    function handleQuantiyIncrement(e){
        e.stopPropagation();
        if(quantity<stockQuantity){
            setQuantity(prev=>prev+1)
            addToCart(item?.product?.productId,1);
        }
    }

    function handleDeleteItem(e) {
        e.stopPropagation();

        // Displaying confirmation dialog
        Swal.fire({
            html:`
            <div class='swal-div-content'>
                <img class='sweet-alert-img-product' src=${item?.product?.primaryImageUrl} height="100px" alt="product-img"></img>
                <p class="sweet-alert-cart-del-msg">Are you sure you want to remove this item from the cart?</p>
            </div>
            `,
            showDenyButton: true,
            showCancelButton: true,
            denyButtonText: "Move to Wishlist",
            confirmButtonText: "Remove from Cart",
            cancelButtonText:`<svg class="en-cloce-icon-swal" width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M4.29289 19.7071C3.90237 19.3166 3.90237 18.6834 4.29289 18.2929L10.5858 12L6.49289 7.90711C6.47946 7.89368 6.46649 7.87997 6.45399 7.86599C6.44048 7.85386 6.42721 7.84129 6.41421 7.8283C6.2189 7.63298 6.12124 7.37718 6.12124 7.12125L6.12411 6.55814C6.12411 6.40323 6.06113 6.26317 5.95936 6.1619C5.85808 6.06013 5.71802 5.99714 5.56312 5.99714L5 6.00001C4.74407 6.00001 4.48827 5.90235 4.29296 5.70704C3.90245 5.31654 3.90245 4.68345 4.29296 4.29295C4.68346 3.90245 5.31654 3.90245 5.70704 4.29295C5.90236 4.48826 5.99989 4.74419 5.99989 5.00012L5.99702 5.56324C5.99702 5.71814 6.06001 5.8582 6.16178 5.95948C6.26305 6.06125 6.40311 6.12423 6.55802 6.12423L7.12113 6.12136C7.37706 6.12136 7.63299 6.2189 7.8283 6.41421C7.84135 6.42725 7.85395 6.44057 7.86613 6.45413C7.88006 6.4666 7.89372 6.47952 7.9071 6.4929L12 10.5858L18.2929 4.29289C18.6834 3.90237 19.3166 3.90237 19.7071 4.29289C20.0976 4.68342 20.0976 5.31658 19.7071 5.70711L13.4142 12L19.7071 18.2929C20.0976 18.6834 20.0976 19.3166 19.7071 19.7071C19.3166 20.0976 18.6834 20.0976 18.2929 19.7071L12 13.4142L5.70711 19.7071C5.31658 20.0976 4.68342 20.0976 4.29289 19.7071Z" fill="#192B37"/>
                                </svg>
                                `,
            customClass: {
            popup: 'custom-popup',  
            confirmButton: 'custom-confirm-button',
            denyButton: 'custom-deny-button', 
            cancelButton: 'custom-cancel-button'
        },
        }).then((result) => {
            if (result.isConfirmed) {

                // If User clicked "Remove from Cart"
                deleteFromCart(item?.product?.productId);

                Swal.fire({
                    html: `
                    <div class='swal-div-content'>
                        <p class="sweet-alert-cart-del-msg">The item has been removed from your cart.</p>
                    </div>
                    `,
                    icon: "success",
                    confirmButtonText: "OK",
                    customClass: {
                        popup: 'custom-popup',
                        confirmButton: 'custom-confirm-button'
                    }
                });

            } else if (result.isDenied) {

                // If  User clicked "Move to Wishlist"
                moveToWishList(item?.product?.productId);

                Swal.fire({
                    html: `
                    <div class='swal-div-content'>
                        <p class="sweet-alert-cart-del-msg">The item has been moved to your wishlist.</p>
                    </div>
                    `,
                    icon: "info",
                    confirmButtonText: "OK",
                    customClass: {
                        popup: 'custom-popup',
                        confirmButton: 'custom-confirm-button'
                    }
                });
            }
        });
    }
    
    return (    
            
        <div className={isPremium?'cart-item-card-premium mb-3':'cart-item-card mb-3'} >
            <div className='cart-item-delete-btn-div'>

                <DeleteIcon className="cart-icon cart-item-delete-btn" onClick={handleDeleteItem}/>
            </div>
            <div className="cart-item-img-div" onClick={()=>takeToProductPage(item?.product?.slug)}>
                <img className='item-img' src={item?.product?.primaryImageUrl} height="200px" alt='product-img'></img>
            </div>
            <div className='cart-item-content-div'>
                <p className='cart-item-name'>{productName}</p>
                <p className='cart-item-varient-info'>{productWeight} {productFlavour && "|"} {productFlavour} </p>
                <div className='cart-item-price'>
                    <p className='cart-item-discounted-price pe-2'>&#8377;{(item?.quantity)*(item?.product?.discoutedPrice)}</p>
                    <p className='cart-item-actual-price pe-2'>&#8377;{(item?.quantity)*(item?.product?.basePrice)}</p>
                    <p className='cart-item-save-price'>Saved &#8377;{(item?.quantity)*(item?.product?.basePrice)-(item?.quantity)*(item?.product?.discoutedPrice)}</p>
                </div>

                {item?.product?.slug?.includes("mb-premium-membership-12-months") === false && (
                    <CartPageExpectedDelivery expectedDelivey={2}/>
                )}
                

                <p className='ednava-cash-each-cart-item'>
                    <img src='/EScash2.png' alt='es-cash' height="16px"></img>
                    <span className='ms-1'>Earn &#8377;{parseInt((earnRate*(item?.quantity)*(item?.product?.discoutedPrice))/100)} ES Cash</span>
                </p>

                {item?.product?.slug?.includes("mb-premium-membership-12-months") === false && (
                    <div className='cart-item-buttons'>
                        
                        <div className='change-quantity-container'>
                            <button className='minus-button' onClick={handleQuantiyDecrement}>-</button>
                            {quantity}
                            <button className='plus-button' onClick={handleQuantiyIncrement}>+</button>
                        </div>

                        <button className='move-to-wishlist-btn' onClick={(e)=>{
                            e.stopPropagation();
                            moveToWishList(item?.product?.productId);
                        }}>Move to Wishlist</button>
                    
                    </div>
                )}

            </div>



        </div>

    )
}

export default CartItem