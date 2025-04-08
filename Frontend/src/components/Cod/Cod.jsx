import React from 'react'
import WarningIcon from '@mui/icons-material/Warning';

function Cod(props) {
  return (
    <div className='cash-on-delivery-section'>
    <div className='cod-msg-container'>
        <div className='cod-warning-msg-div'>
            <p className='warning-message'><WarningIcon/> You will earn 0 ES cash through COD.Pay online to earn {parseInt(0.05*(props.totalDiscountedPrice))} ES Cash!</p>
        </div>
        <div className='cod-info-msg-div mt-4'>
            <p className='cod-info-msg'>
                <img src='/ESCash2.png' alt='es-cash' height="25px"></img>
                <p className='ms-1'>Existing ES cash cannot be used on Cash on Delivery orders</p>
            </p>
        </div>
    </div>

    <div className='cod-buttons mt-4'>
        <button className='pay-cod-btn' onClick={props.initiateOrder}>Pay Via COD</button>
        <button className='pay-online-btn' onClick={()=>props.handleOptionChange("upi")}>Pay Online</button>
    </div>
    
</div>
  )
}

export default Cod