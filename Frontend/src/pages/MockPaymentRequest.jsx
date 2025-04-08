import axios from 'axios';
import React, { useContext, useState } from 'react'
import BounceLoader from "react-spinners/BounceLoader";
import "../css/MockPaymentRequest.css"
import { useLocation, useNavigate } from 'react-router-dom';
import { CartContext } from '../context/CartContext';
import Swal from 'sweetalert2';
import toast from 'react-hot-toast';
import PaymentLoading from '../components/PaymentLoading/PaymentLoading';
function MockPaymentRequest() {
    const location = useLocation();
    const {clearCart}=useContext(CartContext)
    let navigate=useNavigate();
    let [paymentProcessing,setPaymentProcessing]=useState(false);
    const { orderId, paymentMethod, paymentAmount } = location.state || {};

    if (!orderId || !paymentMethod || !paymentAmount) {
        return <p style={{color:"white",textAlign:"center",fontSize:"30px",marginTop:"100px"}}>Invalid payment request. Please try again.</p>;
    }
    

    async function handlePayment(isSuccess){

        let paymentDto={
            orderId:orderId,
            paymentMethod:paymentMethod,
            paymentAmount:paymentAmount
        }
        try{
            setPaymentProcessing(true);
            
            // await new Promise(resolve => setTimeout(resolve, 3000));

            let response=await axios.post(`${process.env.REACT_APP_PAYMENT_SERVICE_API}?isSuccess=${isSuccess}`, paymentDto, {
                headers: {
                    'Accept': "application/json",
                    "Content-Type": "application/json"
                }
            });

            if(response.status === 200){
                if(isSuccess){
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
                }else{
                    Swal.fire({
                        title: "❌ Payment Failed!",
                        html: `
                            <div class='swal-payment-failed'>
                                <p>Oops! Something went wrong while placing your order.🛑</p>
                                <p>Don't worry, you can try again or use another method. 💳</p>
                            </div>
                        `,
                        icon: "error",
                        confirmButtonText: "Try Again",
                        customClass: {
                            popup: 'custom-popup',  
                            confirmButton: 'custom-confirm-button',
                        },
                    }).then(() => {
                        navigate("/account/MyAccount",{
                            state:"myorders"
                        });
                    });                
                }
            }
        }catch(err){
            if(err.status===409){
                Swal.fire({
                    title: "🚨 Payment Failed!",
                    html: `
                        <div class='swal-payment-failed'>
                            <p>Your payment session has expired.⏳</p>
                            <p>Please try again by placing a new order.</p>
                        </div>
                    `,
                    icon: "error",
                    confirmButtonText: "OK",
                    customClass: {
                        popup: 'custom-popup',  
                        confirmButton: 'custom-confirm-button',
                    },
                }).then(() => {
                    navigate("/account/MyAccount",{
                        state:"myorders"
                    });
                });
            }
            else{
                toast.error("Something Went Wrong",{
                    position:"bottom-center",
                    style:{
                            border:"1px solid white",
                            color:"white",
                            backgroundColor:"#30404B",
                    }
                    ,iconTheme: {
                        primary: '#FF5640',
                        secondary: 'white',
                      },
                })
            }
        }
    }

    function handleCancelPayment(){
        Swal.fire({
            title: "🚨 Payment Canceled!",
            html: `
                <div class='swal-payment-failed'>
                    <p>You’ve canceled the payment.🛑</p>
                    <p>You can still complete it within 5 min from MyOrders</p>
                </div>
            `,
            icon: "error",
            confirmButtonText: "OK",
            customClass: {
                popup: 'custom-popup',  
                confirmButton: 'custom-confirm-button',
            },
        }).then(() => {
            navigate("/account/MyAccount",{
                state:"myorders"
            });
        });
    }
  return (
    <div className='mock-payment-body-request-container'>
    

    {!paymentProcessing?(
        <div className='mock-payment-request-container'>
        <div className='mock-payment-request-box mt-5'>
                <p className='mock-payment-info-msg'>Please Accept the Collect Request sent to your UPI app</p>
                <BounceLoader color='blue'/>
                <div className="mock-payment-success-failure">
                    <button className='mock-payment-success' onClick={()=>handlePayment(true)}>Success</button>
                    <button className='mock-payment-failure' onClick={()=>handlePayment(false)}>Failure</button>
                </div>
                <div className='payment-cancel'>
                    <hr></hr>
                    <button className='mock-payment-cancel' onClick={handleCancelPayment}>Cancel Payment</button>
                </div>
        </div>

        <div className='provider mt-4'>
            <img src='/razorpay-icon-png.png' alt='razor-pay-icon' height="50px" width="auto"></img>
        </div>

        
    </div>
    ):(
        <PaymentLoading/>
    )}

    </div>
  )
}

export default MockPaymentRequest