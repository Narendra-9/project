import React, { useContext, useEffect, useState } from "react";
import { UPI_REGEX } from "../../config/config.js"
import InputErrorMessage from '../InputErrorMessage/InputErrorMessage.jsx';
import CircularProgress from '@mui/material/CircularProgress';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import { UserConext } from "../../context/UserContext.jsx";
import axios from "axios";
import Accordion from '@mui/material/Accordion';
import AccordionDetails from '@mui/material/AccordionDetails';
import AccordionSummary from '@mui/material/AccordionSummary';
import "./UpiInput.css"
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import toast from "react-hot-toast";

function UpiInput(props) {
    let [isValid,setIsValid]=useState(false)
    let [upiInvalidError,setUpiInvalidError]=useState(null)
    let [verificationOngoing,setVerificationOngoing]=useState(false)
    let [upiIdInput,setUpiIdInput]=useState("")
    let [saveUpi,setSaveUpi]=useState(false);
    let [savedUpis,setSavedUpis]=useState([]);
    let [selectedUpi,setSelectedUpi]=useState(null)
    const {user}=useContext(UserConext)
    const {initiateOrder,totalDiscountedPrice}=props
    
    useEffect(()=>{
        if(user?.userId){
            async function getAllSavedUpiidsForUser(){
                let response = await axios.get(`${process.env.REACT_APP_UPI_DETAILS_SERVICE_API}?userId=${user?.userId}`)
                setSavedUpis(response.data.body)
            }
            getAllSavedUpiidsForUser();
        }
    },[user])

    function handleUpiInputChange(e){
        setIsValid(false)
        setUpiInvalidError(false)
        setUpiIdInput(e.target.value)
    }

    function checKUpiId() {
        setVerificationOngoing(true);
        setTimeout(() => {
            if (UPI_REGEX.test(upiIdInput)) {
                setIsValid(true);
                setUpiInvalidError(null);
            } else {
                setIsValid(false);
                setUpiInvalidError("Invalid UPI ID");
            }
            setVerificationOngoing(false);
        }, 2000);
    }

    function handleUpiSelect(savedUpiId){
        setSelectedUpi(savedUpiId)
        setUpiIdInput("")
        setIsValid(false)
        setUpiInvalidError(false)
    }

    async function handleOrderPlacement(){
      if(saveUpi){
        try{
          await axios.post(process.env.REACT_APP_SAVED_UPI_SERVICE, {
            userId:user?.userId,
            upiId:upiIdInput
          }, {
            headers: {
                'Accept': "application/json",
                "Content-Type": "application/json"
            }
        });
        await initiateOrder();
        }catch(e){
          if(e.status===409){
            toast.error("Cannot Save Duplicate UPI IDs", {
              position: "bottom-center",
              style: {
                border: "1px solid white",
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
    <div className="upi-section-container">

        <Accordion className="saved-upi-accordian">
            <AccordionSummary expandIcon={<ArrowDropDownIcon/>} aria-controls="panel1-content" id="panel1-header">
            <p className="saved-upi-heading">Saved UPI</p>
            </AccordionSummary>
            <AccordionDetails>
                {savedUpis?.length>0 ? savedUpis?.map(upi=>{
                                return (
                                    <div className={selectedUpi===upi?.savedUpiId?"saved-upi-item selected-upi-item":"saved-upi-item" } onClick={()=>handleUpiSelect(upi?.savedUpiId)}> 
                                        <p>{upi?.maskedUpiId}</p>
                                    </div>
                                    
                                )
                            })
                    :(
                        <p>No Saved Cards Found</p>
                    )}
            </AccordionDetails>
        </Accordion>
        
        <hr style={{width:"350px"}}></hr>

        <div className="upi-input-div">
          <div className="upi-input-relative">
            <input
              className="upi-input"
              name="upiId"
              placeholder="Please enter your UPI ID"
              value={upiIdInput}
              onChange={handleUpiInputChange}
              onFocus={()=>setSelectedUpi(null)}
            ></input>
            <p className="upi-verify">
              {!verificationOngoing ? (
                isValid ? (
                  <CheckCircleIcon />
                ) : (
                  !(selectedUpi)?<span onClick={checKUpiId}>Verify</span>:""
                )
              ) : (
                <CircularProgress
                  size={25}
                  sx={{ color: "#FF5640", marginTop: "5px" }}
                />
              )}
            </p>
          </div>
        </div>
        {upiInvalidError && (
          <InputErrorMessage errorMessage={"Invalid UPI Id"} />
        )}

        {!selectedUpi && (
          <div className="upi-save mt-3">
          <input
            className="upi-save-checkbox"
            checked={saveUpi}
            onChange={(e) => setSaveUpi(e.target.checked)}
            type="checkbox"
            id="upi-save"
          ></input>
          <label htmlFor="upi-save" className="upi-save-label">
            Save this UPI for the next time
          </label>
        </div>
        )}
        

        {(isValid || selectedUpi) && (
          <button className="secure-pay-btn" onClick={handleOrderPlacement}>
            SECURELY PAY &#8377;{totalDiscountedPrice}
          </button>
        )}

    </div>
  );
}

export default UpiInput;
