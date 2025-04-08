import React, { useContext, useEffect, useState } from 'react'
import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import "./OrderAccordian.css"
import PendingIcon from '@mui/icons-material/Pending';
import CancelIcon from '@mui/icons-material/Cancel';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import { useNavigate } from 'react-router-dom';
import CurrencyRupeeIcon from '@mui/icons-material/CurrencyRupee';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import { ThemeContext } from '../../context/ThemeContext';

function OrderAccordian({order,handleShow}) {
    let navigate=useNavigate();
    const [remainingTime, setRemainingTime] = useState(0);
    const {isPremium}=useContext(ThemeContext);
    useEffect(() => {
        if (order?.orderStatus === "PENDING" && order?.paymentSession?.expiresAt) {
            const expiryTime = new Date(order.paymentSession.expiresAt).getTime();
            let timer;
            const updateTimer = () => {
                const now = new Date().getTime();
                const timeLeft = Math.max(0, Math.floor((expiryTime - now) / 1000)); // Convert to seconds
                
                setRemainingTime(timeLeft);

                if (timeLeft <= 0) {
                    clearInterval(timer);
                }
            };

            updateTimer(); // Initial call
            timer = setInterval(updateTimer, 1000); // Update every second

            return () => clearInterval(timer); // Cleanup interval on unmount
        }
    }, [order]);

    const formatTime = (seconds) => {
        const minutes = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    };

    function formatDate(date){
        const formattedDate = new Date(date).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
            hour12: true,  // Ensures AM/PM format
        });
        return formattedDate;
    }


  return (
    <Accordion className={isPremium?'user-order-accordian-premium mb-2':'user-order-accordian mb-2'}>
        <AccordionSummary className='user-order-accordain-summary' expandIcon={<ArrowDropDownIcon />} aria-controls="panel2-content" id="panel2-header">
          <div className='order-transaction-details'>
            <div className='left-corner-div'>
                <div className='payment-status-icon-div'>
                    {(order.orderStatus==="PENDING" && remainingTime!==0) && (
                        <PendingIcon className='payment-status-icon ppending'/>
                    )}
                    {(order.orderStatus==="CANCELED" || (remainingTime===0 && order.orderStatus!=="PLACED")) && (
                        <CancelIcon  className='payment-status-icon pfailed'/>
                    )}
                    {order.orderStatus==="PLACED" && (
                        <CheckCircleIcon  className='payment-status-icon psuccess'/>
                    )}
                </div>
                <div className='order-txn-data'>
                    <p className='order-txn-id'>Transaction ID :- {order?.paymentSession?.paymentSessionId} [No.Of Items {order?.listOfOrderItems?.length}]</p>
                    {(order.orderStatus==="PENDING" && remainingTime!==0)&& (
                        <p className='user-order-payment-status ppending'>Payment Pending</p>
                    )}
                    {(order.orderStatus==="CANCELED" || (remainingTime===0 && order.orderStatus!=="PLACED")) && (
                        <p className='user-order-payment-status pfailed'>Payment Failed</p>
                    )}
                    {order.orderStatus==="PLACED" && (
                        <p className='user-order-payment-status psuccess'>Payment Successful</p>
                    )}
                </div>
            </div>

            
                <div className='right-corner-div'>
                {(order.orderStatus==="PENDING" && remainingTime!==0) ? (
                    <div className='remaining-time-div'>
                        <p className='remaining-time-text'>Remaining Time : </p>
                        <p className='remaining-time ms-2 me-2'>{formatTime(remainingTime)}</p>                        
                    </div>
                ):(
                    <p className='user-order-placed-date'>{formatDate(order?.createdAt)}</p>
                )}
                    
                </div>
                    
            
          </div>
        </AccordionSummary>
        <AccordionDetails>
            {order?.listOfOrderItems.map((orderItem)=>{
                let productNameSplittedArray=orderItem?.product?.productName?.split(",")
                let productName;
                let productVarient=productNameSplittedArray[1];
                if(productNameSplittedArray.length>2){
                    productName=productNameSplittedArray[0]
                    productVarient=productNameSplittedArray[1]+" "+productNameSplittedArray[2]
                }
                return (
                    <div key={orderItem?.orderItemId} className='order-item-div'>
                        <div className='order-item'>
                            <div className='order-item-img' onClick={()=>navigate(`/products/${orderItem?.product?.slug}`)}>
                                <img src={orderItem?.product.primaryImageUrl} alt='product-img' height="120px"></img>
                            </div>
                            <div className='order-item-bought-deatils'>
                                <p className='order-item-name'>{productName}</p>
                                <p className='order-item-quantity-varient mt-2'>
                                    <span>Qty : {orderItem?.quantity} </span>|<span>{productVarient}</span>
                                </p>
                            </div>
                        </div>
                        {order?.orderStatus==="PLACED" && (<p className='order-add-review' onClick={()=>handleShow(orderItem?.product)}>Write a product review <ArrowForwardIosIcon className='review-arrow-right'/></p>)}
                    </div>
                )
            })}
            
            {remainingTime!==0 ? (
                <div className='cancel-order-div'>
                <button className='myorders-btn'>
                <CancelIcon/>
                <span className='ms-2'>Cancel Payment</span></button>

                <button className='myorders-btn'onClick={()=>{
                    navigate("/mockpayment",{
                        state:{
                            orderId:order?.orderId,
                            paymentMethod:sessionStorage.getItem("paymentMethodSelected"),
                            paymentAmount:order?.totalOrderAmount
                        }
                    })
                }}>
                <CurrencyRupeeIcon/>
                <span className='ms-2'>Pay Now</span>
                </button>
                
                </div>
            ):(
                order.orderStatus==="PLACED" && (
                    <div className='order-placed-btns-div mt-3'>
                        <button className='myorders-btn myorders-order-view-order-info' onClick={()=>navigate("/orders/details",{
                            state:{order}
                        })}>View order details</button>
                    </div>
                )
            )}


            
        </AccordionDetails>
      </Accordion>
  )
}

export default OrderAccordian