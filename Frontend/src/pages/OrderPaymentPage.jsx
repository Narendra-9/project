import React, { useContext, useState } from 'react'
import "../css/OrderPaymentPage.css"
import { CartContext } from '../context/CartContext';
import OrderSummary from '../components/OrderSummary/OrderSummary.jsx';
import UpiInput from '../components/UpiInput/UpiInput.jsx';
import CardPayment from '../components/CardPayment/CardPayment.jsx'
import Cod from '../components/Cod/Cod.jsx';
import { UserConext } from '../context/UserContext.jsx';
import { useLocation, useNavigate} from 'react-router-dom';
import axios from 'axios';
import Swal from 'sweetalert2';
import MUIStepper from '../components/MUIStepper/MUIStepper.jsx';
import { ThemeContext } from '../context/ThemeContext.jsx';
import showToast from '../components/CustomToast/CustomToast.js';
import MUIStepperPremium from '../components/MUIStepper/MUIStepperPremium.jsx';


function OrderPaymentPage() {
        const {cart,earnRate,clearCart,totalItems,totalBasePrice,totalDiscountedPrice}=useContext(CartContext);
        const {user} = useContext(UserConext);
        const {isPremium}=useContext(ThemeContext)
        const cartItems=cart?.cartItems||[];
        const location = useLocation();
        const searchParams = new URLSearchParams(location.search);
        let [paymentMethodSelected,setPaymentMethodSelected]=useState("upi")
        sessionStorage.setItem("paymentMethodSelected","upi")
        let navigate=useNavigate();
        const {orderTotal,pointsUsing}=location?.state || {orderTotal:totalDiscountedPrice,pointsUsing:0};


        if(!cart || cart?.cartItems?.length===0){
            return (
                <div className='empty-cart-payment-message'>
                    <h3>ALERT: INVISIBLE CART DETECTED!</h3>
                    <p>We checked… and double-checked… and triple-checked…</p>
                    <p>But nope, your cart is emptier than my fridge on a Sunday night.😉</p>
                </div>
            )
        }

        function handleOptionChange(option){
            sessionStorage.setItem("paymentMethodSelected",option)
            setPaymentMethodSelected(option)
        }

        async function initiateOrder(){
            let userId=user?.userId;
            let listOfOrderItemsDtos=cartItems?.map(i=>{
                return {
                    productId:i?.product?.productId,
                    quantity:i?.quantity
                }
            })
            let selectedAddress=parseInt(searchParams.get("selectedAddress"));
            let ordersDto={
                userId:userId,
                listOfOrderItemDtos:listOfOrderItemsDtos,
                orderTotal:orderTotal,
                esCashUsed:pointsUsing,
                userAddressId:selectedAddress
            }
            try{
                let response=await axios.post("http://localhost:8080/orders", ordersDto, {
                    headers: {
                        'Accept': "application/json",
                        "Content-Type": "application/json"
                    }
                });

                if(paymentMethodSelected!=="cod"){
                    navigate("/mockpayment",{
                        state:{
                            orderId:response.data.body.orderId,
                            paymentMethod:paymentMethodSelected,
                            paymentAmount:response.data.body.totalOrderAmount
                        }
                    })
                }
                else{

                    let paymentDto={
                        orderId:response.data.body.orderId,
                        paymentMethod:paymentMethodSelected,
                        paymentAmount:response.data.body.totalOrderAmount
                    }
                    try{
                        await axios.post(`${process.env.REACT_APP_PAYMENT_SERVICE_API}?isSuccess=${true}`, paymentDto, {
                            headers: {
                                'Accept': "application/json",
                                "Content-Type": "application/json"
                            }
                        });
                        Swal.fire({
                            title: "🎉 Order Placed Successfully!",
                            html: `
                                <div class='swal-order-success'>
                                    <p>Your order has been placed successfully. 🎊</p>
                                    <p>Thank you for shopping with us! 🛍️</p>
                                    <p>We will send you a mail shorly 🚚</p>
                                </div>
                            `,
                            icon: "success",
                            confirmButtonText: "OK",
                            customClass: {
                                popup: 'custom-popup',  
                                confirmButton: 'custom-confirm-button',
                            },
                        }).then(() => {
                            clearCart();
                            navigate("/account/MyAccount",{
                                state:"myorders"
                            });
                        });
                    }catch(err){
                        showToast("Something Went Wrong","error")
                        console.error(err);
                    }
                }
                
            }catch(err){
                if(err.status===400){
                    showToast("Address_ID not linked to User","error")
                }
                else if(err.status===404){
                    showToast("Invalid Address","error")
                }
                else{
                    showToast("Something Went Wrong","error")
                    console.error(err);
                }
            }
        }
        
  return (
    <div className={isPremium?'order-payment-page order-payment-page-premium':'order-payment-page'}>

        <div className='order-payment-page-left-section'>
            <OrderSummary pointsUsing={pointsUsing} orderTotal={orderTotal} totalItems={totalItems} earnRate={earnRate} totalBasePrice={totalBasePrice} totalDiscountedPrice={totalDiscountedPrice}/>
        </div>

        <div className='order-payment-page-right-section'>

            <div className='order-payment-page-stepper mt-4 mb-4'>
                {isPremium? (<MUIStepperPremium activeStep={2}/>):(<MUIStepper activeStep={1}/>)}
            </div>

            <div className='payment-methods'>
                <div className={paymentMethodSelected==="upi"?"payment-method selected":"payment-method"} onClick={()=>handleOptionChange("upi")}>
                    <p>Pay Using UPI</p>
                    <img src="https://static1.hkrtcdn.com/mbnext/static/media/common/SecurePayment/upi.svg" alt='upi'></img>
                </div>

                <div className={paymentMethodSelected==="card"?"payment-method selected":"payment-method"} onClick={()=>handleOptionChange("card")}>
                    <p>Debit/Credit Card </p>
                    <img src="https://static1.hkrtcdn.com/mbnext/static/media/common/SecurePayment/visa.svg" alt='upi'></img>
                    <img src="https://static1.hkrtcdn.com/mbnext/static/media/common/SecurePayment/rupay.svg" alt='upi'></img>
                    <img src="https://static1.hkrtcdn.com/mbnext/static/media/common/SecurePayment/master.svg" alt='upi'></img>
                </div>

                <div className={paymentMethodSelected==="cod"?"payment-method selected":"payment-method"} onClick={()=>handleOptionChange("cod")}>
                    <p>Cash On Delivery</p>
                </div>

            </div>

            <hr></hr>

            <div className='payment-methods-inputs'>

                {paymentMethodSelected==="upi"&&<UpiInput totalDiscountedPrice={totalDiscountedPrice} initiateOrder={initiateOrder}/>}

                {paymentMethodSelected==="card"&&<CardPayment totalDiscountedPrice={totalDiscountedPrice} initiateOrder={initiateOrder}/>}

                {paymentMethodSelected==="cod" &&<Cod handleOptionChange={handleOptionChange} totalDiscountedPrice={totalDiscountedPrice} initiateOrder={initiateOrder}/>}

            </div>
        </div>
    </div>
  )
}

export default OrderPaymentPage