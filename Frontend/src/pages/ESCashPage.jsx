import React from 'react'
import "../css/ESCashPage.css"
import { useNavigate } from 'react-router-dom';
import {ReactComponent as LockIcon} from "../assets/lock.svg"

function ESCashPage() {
    let navigate=useNavigate();
  return (
    <div className='es-cash-page'>
        <div className='es-cash-heading'>
            <img src='/Escash2.png' alt='es-cash' height="50px"></img>
            <h1 className='ms-2' style={{color:"#ffcc00"}}>ES Cash</h1>
        </div>


        <div className='es-cash-description mt-3'>
            <p>Shopping could not have been more fun. Now for every purchase you make at endava strength, earn special points. These points are called 'ES Cash' that can be redeemed on your next purchase.</p>
            <p style={{fontWeight:"bold"}}>How do I earn <span style={{color:"#ffcc00"}}>ES Cash</span>?</p>
            <p style={{margin:"0"}}>Depending on the product you buy and the payment mode selected, there will be 'X' points that will be credited in your 'reward points' account. This also means that each product has different points than the other</p>
            <p style={{}}>The exact points are mentioned on the product page itself.</p>
            <p style={{fontWeight:"bold"}}>How do I redeem <span style={{color:"#ffcc00"}}>ES Cash</span>?</p>
            <p>Once your order is successfully delivered and passed the 14-day return, ES Cash will be credited to your account. You can immediately use them against your next order, or stack them and use it against any product. ES cash is valid only on all prepaid payment modes i.e. Net banking, all Bank Debit & Credit Cards and Wallets.</p>
            <p style={{fontWeight:"bold"}}>How do I Sign-up for <span style={{color:"#ffcc00"}}>ES Cash</span>?</p>
            <p>It is an easy opt-in. There is no separate sign-up for the program. All you have to do is register with a valid email ID and phone number on endava strength.</p>
        </div>

            <p style={{fontWeight:"bold", color: "red"}}>Please Note:</p>
            <p>Currently, this feature is being prepared. You can still earn ES Cash with every purchase you make, but you won't be able to redeem it until the feature is officially available. Stay tuned for updates!</p>

        <div className='es-cash-continue-shopping-btn-div mt-5'>
            <button className='es-cash-continue-shopping-btn' onClick={()=>navigate('/')}>CONTINUE SHOPPING <LockIcon className="es-cash-page-lock-icon pb-1"/></button>
        </div>
    </div>
  )
}

export default ESCashPage