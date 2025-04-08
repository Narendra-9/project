import React, { useContext, useEffect, useState } from 'react'
import "../css/CartPage.css"
import { CartContext } from '../context/CartContext'
import CartItem from '../components/CartItem/CartItem';
import {ReactComponent as BoxIcon} from "../assets/box.svg"
import {ReactComponent as InfoIcon} from "../assets/info.svg"
import Tooltip from '@mui/material/Tooltip';
import { useNavigate } from 'react-router-dom';
import CashPointsSlider from '../components/CashPointsSlider/CashPointsSlider';
import { debounce } from 'lodash';
import {ReactComponent as PremiumIcon} from "../assets/premium-icon.svg"
import { ThemeContext } from '../context/ThemeContext';
import MUIStepper from '../components/MUIStepper/MUIStepper';
import MUIStepperPremium from '../components/MUIStepper/MUIStepperPremium';


function CartPage() {
    // * Getting the required things from the Cart Context
    const { cart , earnRate , totalItems , totalBasePrice , totalDiscountedPrice, premiumOffer, addToCart }=useContext(CartContext);
    const [cartItems,setCartItems]=useState([])

    const {isPremium}=useContext(ThemeContext)

    // * State to track premium is present or not.
    const [hasPremiumInCart,setHasPremiumInCart] = useState(false);

    // * Made an extra state as orderTotal for calculating the final Amount after Escash & Offers
    const [orderTotal,setOrderTotal]=useState(0)

    // * Holds the EsCash using for the order.
    const [pointsUsing,setPointsUsing]=useState(0);
    let navigate=useNavigate();

    useEffect(() => {
        // Setting up the things only when cart is not empty
        if(cart?.cartItems){
            setCartItems(cart?.cartItems);
            setOrderTotal(totalDiscountedPrice)
            const premiumExists=cart?.cartItems.some(item => item?.product?.slug && item.product.slug.includes("mb-premium-membership-12-months"));
            setHasPremiumInCart(premiumExists);
        }
    },[cart,totalDiscountedPrice,isPremium])

    // ! If there are no cartItems, it shows some message 
    if(cartItems.length===0){
        return (
            <div className='no-items-in-cart-container'>
                <img src='/sqat_loading.gif' alt='no-items-in-cart' width="450px"></img>
                <h2>OH NO!</h2>
                <p className='tag-line'>Stuck on the same weight? Our products are your secret weapon to lift heavier, faster!</p>
                <button className='shop-endava-btn' onClick={()=>navigate("/")}>Shop endava strength</button>
            </div>
        )
    }

    // ! function to handle Slider change
    const handleSliderChange=debounce((value) => {
        setPointsUsing(value)
        // updating the total based on the slider change.
        const updatedTotal=totalDiscountedPrice-value;
        setOrderTotal(updatedTotal)
    },500);

    // ! function which navigates to CheckOut Page via passing the required states
    const handleToCheckout=() => {
        navigate("/checkout",{
            state:{
                orderTotal:orderTotal,
                pointsUsing:pointsUsing
            }
        })
    }

  return (
    <div className='cart-page-container'>

        <div className='cart-page-left-container'>

            <div className='cart-page-stepper'>
                {isPremium? (<MUIStepperPremium activeStep={0}/>):(<MUIStepper activeStep={0}/>)}
            </div>

            <div className='main-cart-page-cart-items-container'>
                {cartItems.map((item) => {
                    return (
                        <CartItem key={item?.cartItemId} item={item}/>
                    )
                })}
            </div>
            
        </div>

        <p className='vertical-divider'></p>

        <div className='cart-page-right-container'>

            <div className='order-summary-container mt-5'>
                <div className='order-summary-header-accordian'>
                    <BoxIcon className="order-summary-box-icon "/>
                    <p className='order-summary-heading ms-2'>Order summary ({totalItems} Items)</p>
                </div>
                <div className='endava-strength-earn-div'>
                    <img src="/EScash2.png" height="30px" alt='coin-img'></img>
                    <span className='ms-1'>You will earn &#8377;{parseInt((earnRate*totalDiscountedPrice)/100)} ES Cash on this purchase </span>
                </div>
                <div className='order-summary-details'>
                    <div className='order-summary-row mb-3'>
                        <span>Price</span><span>&#8377;{totalBasePrice}</span>
                    </div>
                    <div className='order-summary-row mb-3'>
                        <span>Convenience Fee
                        <Tooltip title={<div className='delivery-fee-tool-tip'>Delivery Fee : Free</div>}>
                            <InfoIcon className="cart-page-info-icon ms-1"/>
                        </Tooltip>
                        </span><span>&#8377;0</span>
                    </div>
                    <div className='order-summary-row mb-3'>
                        <span>Discount
                        <Tooltip title={<div className='discount-tool-tip'>endava strength Discount : -{totalBasePrice-totalDiscountedPrice}</div>}>
                        <InfoIcon className="cart-page-info-icon ms-1"/>
                        </Tooltip>
                        </span><span>-&#8377;{totalBasePrice-totalDiscountedPrice}</span>
                    </div>
                    

                    <div className='order-summary-row mb-3'>
                        <CashPointsSlider orderTotal={totalDiscountedPrice} onChange={handleSliderChange}/>
                    </div>

                    <hr className='order-summary-separator'></hr>

                    <div className='order-summary-row'>
                        <span>Total Amount</span><span>&#8377;{orderTotal}</span>
                    </div>

                    {(!hasPremiumInCart && !isPremium )&&(
                        <div className='cart-page-premium-info-box mt-4'>
                            <div className='cart-page-premium-info-box-left'>
                                <p className='cart-page-premium-info-heading'>
                                    <span>Save &#8377;{parseInt((premiumOffer*totalDiscountedPrice)/100)} with </span>
                                        <PremiumIcon className='cart-page-premium-icon ms-2'/> 
                                </p>
                                <p className='cart-page-premium-info-sub-heading'>
                                    Add for 1 year at &#8377;299 only
                                </p>
                            </div>

                            <div className='cart-page-premium-info-box-right'>
                                {/* This should be changed in a optimized way ,here  */}
                                <button className='cart-page-premium-add' onClick={()=>addToCart(12,1)}>ADD</button>
                            </div>

                        </div>
                    )}


                    <div className='cart-page-checkout-btn-div mt-4'>
                        <button className='cart-page-checkout-btn' onClick={handleToCheckout}>CHECKOUT</button>
                    </div>

                </div>
            </div>

        </div>

    </div>
  )
}

export default CartPage