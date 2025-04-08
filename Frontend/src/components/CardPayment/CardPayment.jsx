import React, { useContext, useEffect, useState } from 'react'
import {ReactComponent as CardIcon} from "../../assets/credit-card.svg"
import {ReactComponent as InfoIcon} from "../../assets/info.svg"
import Tooltip from '@mui/material/Tooltip';
import { UserConext } from '../../context/UserContext';
import axios from 'axios';
import { Accordion, AccordionDetails, AccordionSummary } from '@mui/material';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import toast from 'react-hot-toast';
import InputErrorMessage from '../InputErrorMessage/InputErrorMessage';

function CardPayment(props) {

    const {initiateOrder,totalDiscountedPrice}=props
    let [cardInput,setCardInput]=useState({
        cardHolderName: "",
        cardNumber: "",
        expiry:"",
        cvv:""
    })

    let [errors, setErrors] = useState({
        cardHolderName: "",
        cardNumber: "",
        expiry: "",
        cvv: "",
    });
    
    const {user}=useContext(UserConext)
    let [saveCard,setSaveCard]=useState(false)
    let [savedCards,setSavedCards]=useState([])
    let [selectedCard,setSelectedCard]=useState(null)
    let [cardType,setCardType]=useState(null)
    let [isVerified,setIsVerified]=useState(false)
    
    useEffect(()=>{
        if(user?.userId){
            async function getAllSavedCardsForUser(){
                let response = await axios.get(`${process.env.REACT_APP_CARD_DETAILS_SERVICE_API}?userId=${user?.userId}`)
                setSavedCards(response.data.body)
            }
            getAllSavedCardsForUser();
        }
    },[user])
    
    function getCardType(cardNumber) {
        const replacedNumber = cardNumber.replace(/\D/g, "");
        if (/^4[0-9]{12}(?:[0-9]{3})?$/.test(replacedNumber)) {
            return "Visa";
        } else if (/^5[1-5][0-9]{14}$/.test(replacedNumber) || /^2(?:2[2-9][1-9]|[3-6][0-9]{2}|7[0-1][0-9]|720)[0-9]{12}$/.test(replacedNumber)) {
            return "MasterCard";
        } else {
            return null;
        }
    }

    function handleCardInputChange(e) {
        let { name, value } = e.target;

        if(name!=="cvv"){
            setIsVerified(false)
            setSelectedCard(false)
        }

        setErrors({
            cardHolderName: "",
            cardNumber: "",
            expiry: "",
            cvv: "",
        })

        if (name === "cardNumber") {
            if (/^\d*$/.test(value) && value.length <= 16) {  
                setCardInput({ ...cardInput, [name]: value });
                setCardType(getCardType(value));
            }
            
        } 
        else if (name === "cardHolderName") {
            if (/^[A-Za-z\s]*$/.test(value)) {
                setCardInput({ ...cardInput, [name]: value });
            }
        } 
        else if (name === "expiry") {
            if (/^\d{0,2}\/?\d{0,2}$/.test(value)) {
                setCardInput({ ...cardInput, [name]: value });
            }
        } 
        else if (name === "cvv") {
            if (/^\d{0,4}$/.test(value)) { 
                setCardInput({ ...cardInput, [name]: value });
            }
        }
    }

    async function handleCardSelect(cardId){
        let response=await axios.get(`${process.env.REACT_APP_CARD_DETAILS_SERVICE_API}/retrieve?savedCardId=${cardId}`);
        if(response.status === 200) {
            let retrievedCard={
                cardHolderName:response.data.body.cardHolderName,
                cardNumber:response.data.body.cardNumber,
                expiry:response.data.body.expiry,
            }
            setCardInput({...cardInput,...retrievedCard})
        }
        setSelectedCard(cardId)
    }

    function validateInput() {
        let newErrors = { };
          newErrors.cardHolderName =
            /^[A-Za-z\s]+$/.test(cardInput.cardHolderName) && cardInput.cardHolderName.trim().length > 0
              ? ""
              : "Invalid Name";
          newErrors.cardNumber =
            /^(?:4[0-9]{12}(?:[0-9]{3})?|5[1-5][0-9]{14}|3[47][0-9]{13}|6(?:011|5[0-9]{2})[0-9]{12})$/.test(
                cardInput.cardNumber.replace(/\s/g, "")
            )
              ? ""
              : "Invalid Card Number";

            const cardType = getCardType(cardInput.cardNumber);
            if (!cardType) {
                newErrors.cardNumber = "Only Visa & MasterCard are accepted";
            } else if (
                (cardType === "Visa" && !(cardInput.cardNumber.length === 13 || cardInput.cardNumber.length === 16)) ||
                (cardType === "MasterCard" && cardInput.cardNumber.length !== 16)
            ) {
                newErrors.cardNumber = "Invalid Card Number Length";
            } else {
                newErrors.cardNumber = "";
            }

          const expiryRegex = /^(0[1-9]|1[0-2])\/?([0-9]{2})$/;
          if (!expiryRegex.test(cardInput.expiry)) {
            newErrors.expiry = "Invalid Format (MM/YY)";
          } else {
            const [month, year] = cardInput.expiry.split("/");
            const expiryDate = new Date(`20${year}`, month, 0);
            const today = new Date();
            newErrors.expiry =
              expiryDate > today ? "" : "Card has expired";
          }
          newErrors.cvv = /^[0-9]{3,4}$/.test(cardInput.cvv) ? "" : "Invalid CVV";
        setErrors(newErrors);
        console.log(newErrors)
        console.log(Object.values(newErrors).every((newErrors) => newErrors === ""))
        setIsVerified(Object.values(newErrors).every((newErrors) => newErrors === ""));
    }

    async function handleCardPayment(){
        if(saveCard){
            let savedCardDto={
                userId:user?.userId,
                cardHolderName:cardInput.cardHolderName,
                cardType:cardType,
                cardNumber:cardInput.cardNumber,
                expiry:cardInput.expiry,
            }
            try{
                await axios.post(process.env.REACT_APP_CARD_DETAILS_SERVICE_API,JSON.stringify(savedCardDto), {
                    headers: {
                        'Accept': "application/json",
                        "Content-Type": "application/json"
                    }
                })
                await initiateOrder();
            }catch(err){
                if(err.status===409){
                    // toast.error("Cannot Save Duplicate UPI IDs")
                    toast.error("Cannot Save Duplicate Cards", {
                      position: "bottom-center",
                      style: {
                        border: "1px solid white",
                        // color: "white",
                        // backgroundColor: "#FF5640",
                      },
                      iconTheme: {
                        primary: "#FF5640",
                        secondary: "white",
                    },
                    });
                }
            }
        }
        else{
            initiateOrder();
        }
    }

return (
    <div className='order-card-payment-section'>

    <Accordion className="saved-upi-accordian">
            <AccordionSummary expandIcon={<ArrowDropDownIcon/>} aria-controls="panel1-content" id="panel1-header">
            <p className="saved-upi-heading">Saved Cards</p>
            </AccordionSummary>
            <AccordionDetails>
                {savedCards?.length>0 ? savedCards?.map(card=>{
                                return (
                                    <div className={selectedCard===card?.savedCardId?"saved-upi-item saved-card-item selected-upi-item":"saved-card-item saved-upi-item" } onClick={()=>handleCardSelect(card?.savedCardId)}> 
                                        <p>{card?.cardNumber}</p>
                                        {card?.cardType==="Visa" && (
                                            <img src="https://static1.hkrtcdn.com/mbnext/static/media/common/SecurePayment/visa.svg" alt='upi'></img>
                                        )}

                                        {card?.cardType==="MasterCard" && (
                                            <img src="https://static1.hkrtcdn.com/mbnext/static/media/common/SecurePayment/master.svg" alt='upi'></img>
                                        )}
                                    </div>
                                    
                                )
                            })
                    :(
                        <p>No Saved Cards Found</p>
                    )}
            </AccordionDetails>
        </Accordion>

    <div className='row'>
        <div className='col-lg-6 mb-2'>
            <input className='upi-input card-input' maxLength={40} name='cardHolderName' placeholder='Name On Card' value={cardInput.cardHolderName} onChange={handleCardInputChange}></input>
            {errors.cardHolderName && <InputErrorMessage errorMessage={errors.cardHolderName}/>}

        </div>
        <div className='col-lg-6 mb-2'>
            <div className='card-number-input-relative'>
                <CardIcon className="card-icon"/>
                <input className='upi-input card-input' maxLength={16} name='cardNumber' placeholder='Card Number' value={cardInput.cardNumber} onChange={handleCardInputChange}></input>
                {errors.cardNumber && <InputErrorMessage errorMessage={errors.cardNumber}/>}
            </div>
        </div>
    </div>

    <div className='row mt-2'>
        <div className='col-lg-6 mb-2'>
            <input className='upi-input card-input' name='expiry' placeholder='Expiry MM/YY' value={cardInput.expiry} onChange={handleCardInputChange}></input>
            {errors.expiry && <InputErrorMessage errorMessage={errors.expiry}/>}
        </div>
        <div className='col-lg-6 mb-2'>
            <div className='cvv-input'>
                <Tooltip title="Enter your 3 digit code from back of your card">
                    <InfoIcon className="cvv-tooltip"/>
                </Tooltip>
                <input className='upi-input card-input' name='cvv' placeholder='CVV' value={cardInput.cvv} onChange={handleCardInputChange}></input>
                {errors.cvv && <InputErrorMessage errorMessage={errors.cvv}/>}
            </div>
        </div>
    </div>
    
    {!selectedCard && (
        <div className='upi-save mt-3'>
        <input className='upi-save-checkbox' checked={saveCard} onChange={(e)=>setSaveCard(e.target.checked)} type='checkbox' id='upi-save'></input>
        <label htmlFor='upi-save' className='upi-save-label'>Save these card details as per the RBI Guidelines for future transactions.</label>
        </div>
    )}
    
    
    <div className='card-verify'>
        <button className='secure-pay-btn-card'
        onClick={handleCardPayment}
        disabled={!isVerified}
        >SECURELY PAY &#8377;{totalDiscountedPrice}</button>
        {!isVerified && (
            <p className='ms-2' onClick={validateInput}>Verify</p>
        )}
        
    </div>
    
</div>
  )
}

export default CardPayment