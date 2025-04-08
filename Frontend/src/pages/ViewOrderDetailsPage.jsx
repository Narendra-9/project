import React, { useRef } from 'react'
import "../css/ViewOrderDetails.css"
import Logo from '../components/Logo/Logo'
import { numberToWords } from "amount-to-words";
import { useLocation } from 'react-router-dom';
import html2canvas from "html2canvas";
import {jsPDF} from "jspdf";

function ViewOrderDetailsPage() {
    const location=useLocation();
    const order=location.state?.order
    const printRef=useRef();
    async function handleDownloadPdf(){
        const element=printRef.current;
        if(!element){
            return;
        }

        const canvas=await html2canvas(element,{
            scale:3,
        });
        const data=canvas.toDataURL('image/png');

        const pdf = new jsPDF({
            orientation: "portrait",
            unit: "px",
            format: "a4",
          }); 

        const imgproperties=pdf.getImageProperties(data);
        const pdfWidth=pdf.internal.pageSize.getWidth();

        const pdfHeight=(imgproperties.height*pdfWidth)/imgproperties.width;
        pdf.addImage(data,'PNG',0,0,pdfWidth,pdfHeight);
        pdf.save('invoice.pdf');
    }

    if(!order){
        return <p>No Order Deatils Available</p>
    }

    function formatDateTime(dateString) {
        return new Date(dateString.replace("T", " ")).toLocaleString();
    }
    
  return (
    <div className='view-order-details'>
        <div className='order-invoice' ref={printRef}>
            <div className='invoice-header'>
                <Logo/>
            
                <div className='order-invoice-right-corner'>
                    <p style={{fontWeight:"bold"}}>Order Invoice</p>
                    <p style={{fontWeight:"bold"}}>(Original for Recipient)</p>
                </div>

            </div>

            <div className='invoice-address-section'>
                <div className='invoice-sold-by-address'>
                    <p style={{fontWeight:"bold"}}>Sold By</p>
                    <p>ES Nutrition Pvt. Ltd</p>
                    <p>6th Floor, Gladiator, ES Nutrition Space, IBRL Tech Park, Battandur Agrahara, Bengaluru, Karnataka, 560066 </p>
                    <p><span>GSTIN:</span><span>09AABCM1234L1ZQ</span></p>
                    <p><span>FSSAI License No.</span><span>10012011000001</span></p>
                    <p><span>Contact:</span><span>en1mgtestemail@gmail.com</span></p>
                </div>

                <div className='inovice-billing-address'>
                    <p style={{fontWeight:"bold"}}>Billing Address : </p>
                    <p>{order?.userAddress?.fullName}</p>
                    <p>{order?.userAddress?.address}</p>
                    <p>{order?.userAddress?.locality}</p>
                    <p>{order?.userAddress?.city}</p>
                    <p>{order?.userAddress?.state}</p>
                    <p>{order?.userAddress?.pincode}</p>
                </div>
            </div>

            <div className='invoice-order-date'>
                <div className='invoide-order-date-details'>
                    <p><span style={{fontWeight:"bold"}}>Order Number:</span><span>#{order?.orderId}</span></p>
                    <p><span style={{fontWeight:"bold"}}>Order Date:</span><span>{order?.createdAt}</span></p>
                </div>

                <div className='invoide-date-details'>
                    <p><span style={{fontWeight:"bold"}}>Invoice Number:<span>#IN-ES{order?.orderId}</span></span></p>
                    <p><span style={{fontWeight:"bold"}}>Invoice Date:</span><span>{order?.createdAt}</span></p>
                </div>
            </div>

            <div className='invoice-order-table'>
                <table>
                    <thead>
                    <tr>
                        <th>Sl No.</th>
                        <th>Description</th>
                        <th>Unit Price</th>
                        <th>Qty</th>
                        <th>Total amount</th>
                    </tr>
                    </thead>
                    <tbody>

                        {order?.listOfOrderItems.map((orderItem,index)=>{
                            return (
                                <tr key={orderItem.orderItemId}>
                                    <td>{index+1}</td>
                                    <td>{orderItem?.product?.productName}</td>
                                    <td>{orderItem?.product?.discoutedPrice}</td>
                                    <td>{orderItem?.quantity}</td>
                                    <td>₹{(orderItem?.quantity)*(orderItem?.product?.discoutedPrice)}</td>
                                </tr>
                            )
                        })}
                        
                        <tr>
                            <td colSpan="4" style={{fontWeight:"bold"}}>Grand Total:</td>
                            <td>₹{order?.totalOrderAmount}</td>
                        </tr>

                        <tr>
                            <td colSpan="5" style={{fontWeight:"bold"}}>
                                <p>Amount in Words:</p>
                                <p>{numberToWords(order?.totalOrderAmount)}</p>
                            </td>
                        </tr>

                        <tr>
                            <td colSpan="5">
                                <div className='invoice-signature'>
                                    <p style={{fontWeight:"bold"}}>For ES Nutrition Pvt Ltd.</p>
                                    <img src='/mysign.png' alt='sign' height="auto" width="100px"></img>
                                    <p style={{fontWeight:"bold"}}>Authorized Signatory</p>
                                </div>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>

            <div className='invoice-last-row'>
                <div className='txn'>
                    <p style={{fontWeight:"bold"}}>Payment_Transaction_ID</p>
                    <p>{order?.payment?.paymentId}</p>
                </div>

                <div className='not-txn'>
                    <p style={{fontWeight:"bold"}}>Date & Time</p>
                    <p>{formatDateTime(order?.createdAt)}</p>
                </div>

                <div className='not-txn'>
                    <p style={{fontWeight:"bold"}}>Invoice Value</p>
                    <p>₹{order?.totalOrderAmount}</p>
                </div>

                <div className='not-txn'>
                    <p style={{fontWeight:"bold"}}>Payment Type</p>
                    <p>{order?.payment?.paymentMethod}</p> 
                </div>
            </div>
        </div>

        <div className='invoice-dwonload-button-div mt-3 mb-4'>
            <button className='invoice-dwonload-button' onClick={handleDownloadPdf}>Download Invoice</button>
        </div>
    </div>
  )
}

export default ViewOrderDetailsPage