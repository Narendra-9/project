import React, { useContext, useEffect, useState } from 'react'
import "./LoginContainer.css"
import { motion } from "motion/react"
import { ReactComponent as ErrorIcon } from "../../assets/error.svg"
import { ReactComponent as CloseIcon } from "../../assets/close.svg"
import axios from 'axios'
import CircularProgress from '@mui/material/CircularProgress';
import { UserConext } from '../../context/UserContext'
import { useNavigate } from 'react-router-dom'
import showToast from '../CustomToast/CustomToast'
import { LABELS } from '../../config/labels'
import toast from 'react-hot-toast'


function LoginContainer(props) {

  const [userEmail,setUserEmail]=useState("");
  const [goToOtpVerification,setGoToOtpVerification]=useState(false);
  const [checkboxes,setCheckboxes]=useState({
    invoice:false,
    communicationConsent:true
  });
  const [invalidEmail,setInvalidEmail]=useState(true);
  const [timer, setTimer] = useState(60); 
  const [timerActive, setTimerActive] = useState(false);
  const [sendingOtp,setSendingOtp] = useState(false);
  const [otp,setOtp]=useState("");
  const {setUserData}=useContext(UserConext);
  const [invalidOtp,setInvalidOtp]=useState(false);
  let navigate=useNavigate();

  useEffect(() => {
    if (timerActive && timer > 0) {
      const interval = setInterval(() => {
        setTimer(prevTimer => prevTimer - 1);
      }, 1000);

      return () => clearInterval(interval);
    } else if (timer <= 0) {
      setTimerActive(false); 
    }
  }, [timer, timerActive]);


  function handleCheckBoxesCheck(e){
    setCheckboxes({...checkboxes,[e.target.value]:e.target.checked});
  }

  function handleEmailInputChange(e){
    setUserEmail(e.target.value);
    setInvalidEmail(!/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(e.target.value));

  }

  function handleOtpInputChange(e){
    setOtp(e.target.value);
    setInvalidOtp(false);
  }

  async function sendOTP(){
    setSendingOtp(true);
    try {
      const response = await axios.post(`http://localhost:8080/auth/send-otp?email=${userEmail}`, {
        headers: {
          'Accept': "application/json",
          "Content-Type": "application/json"
        }
      });
      if (response.status === 200) {
        setGoToOtpVerification(true); 
        setTimer(60);
        setTimerActive(true);
      } else {
        console.error("Failed to send OTP:", response.data);
      }
    } catch (error) {
      toast.dismiss();
      showToast(LABELS.defaultErrorMessage);
      console.error("Error sending OTP:", error);
    } finally {
      setSendingOtp(false); 
    }
  }

  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${minutes}:${secs < 10 ? '0' + secs : secs}`;
  };

  async function verifyOtp(){
    try {
      let loginRequest={
        "email":userEmail,
        "otp":otp
      }
      const response = await axios.post("http://localhost:8080/auth/verify-otp", JSON.stringify(loginRequest), {
        headers: {
          'Accept': "application/json",
          "Content-Type": "application/json"
        }
      });
      console.log(response.data);
      if (response.status === 201) {
        setUserData(response.data.body);
        if(response.data.body.role==="ADMIN"){
          navigate("/admin/home")
        }
        props.closePopUp();
      } 
    } catch (error) {
      if (error.status===400){
        setInvalidOtp(true);
      }
    }
  }

  return (
    <div className='login-container'>

                <div className='img-container'>
                    {/* <div className='logo-on-img'>Day 1 or One Day ?</div> */}
                    <img src='/ai-img.png' height="500px" alt='login-img' className='login-img'></img>
                </div>

                <div className='login-input-container'>

                    <div className='pop-up-close-btn-container'>
                      <button className='pop-up-close-btn' style={{color:"white"}} onClick={props.closePopUp}><CloseIcon className="close-icon" width="15px" height="15px"/></button>
                    </div>

                    <p className='welcome-text mt-1 me-4'>Welcome to </p>
                    {/* <p className='enterprise-name-text'><span style={{color:"#ff5640",fontSize:"50px",margin:"0px"}}>Endava</span> Strength</p> */}
                    <div className='text-center custom-logo ms-5'><img src='/endava_strength_logo.png' height="100px" alt='endava-strength-logo'></img></div>
                    <hr></hr>
                    <div className='input-container' style={{}}>
                      
                      {!goToOtpVerification && 
                        <motion.div 
                        initial={{ x:100 }}
                        animate={{ x: 0 }}
                        exit={{ opacity: 0, x: -100 }}
                        transition={{ duration: 0.5 }}
                        className='email-input-container mt-4'>
                        <label className='email-label'>Email</label>
                        <input type='email' className='email-input mt-2' onChange={handleEmailInputChange}></input>
                        
                        {sendingOtp?(
                          <div className='text-center mt-4'><CircularProgress style={{color:"#ff5640"}} /></div>
                        ):(
                          <button className='request-otp-btn mt-4 button-disabled' type='button' onClick={sendOTP} disabled={(invalidEmail || sendingOtp)}>Request Otp</button>
                        )}
                      </motion.div>
                      }
                      

                      
                      {goToOtpVerification&&(
                        <motion.div
                        initial={{ opacity: 0, x: 100 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -100 }}
                        transition={{ duration: 0.5 }}
                        className='otp-input-container'>
                        <label className='otp-label'>Varification Code</label>
                        <input type='text' className='otp-input mt-2' onChange={handleOtpInputChange} value={otp}></input>
                        
                        {invalidOtp&&<p style={{margin:"0px",color:"red",marginTop:"15px",fontSize:"14px",display:"flex",alignItems:"center"}}><ErrorIcon className="error-icon me-1" width="13px" height="13px"/><span>Invalid OTP</span></p>}


                        <div className='invoice-div mt-3'>
                          <input
                            type="checkbox"
                            className='invoice-input'
                            id="invoice"
                            name="invoice"
                            value="invoice"
                            checked={checkboxes.invoice}
                            onChange={handleCheckBoxesCheck}
                          />
                          <label htmlFor="invoice" className='invoice-label ms-2'>Get invoice and order update on your Email</label>
                        </div>

                        <div className='consent-div mt-3'>
                          <input
                            type="checkbox"
                            className='invoice-input mt-1 '
                            id="communicationConsent"
                            name="communicationConsent"
                            value="communicationConsent"
                            checked={checkboxes.communicationConsent}
                            onChange={handleCheckBoxesCheck}
                          />
                          <label htmlFor="communicationConsent" className='consent-label ms-2'>I consent to receive communication from Endava Strength</label>
                        </div>


                        <div className="timer mt-3">
                            {timerActive?(
                              <p style={{color:"white",margin:"0",fontSize:"12px",textAlign:"center"}}>{formatTime(timer)}</p>
                            ):(
                              <p style={{color:"white",margin:"0",fontSize:"12px",textAlign:"center"}}>Didn't receive the OTP ?<span style={{textDecoration:"underline"}}>Resend OTP</span></p>
                            )}
                            
                        </div>
                        

                        <button className='signin-btn mt-4' type='button' onClick={verifyOtp}>Sign in</button>
                      </motion.div>

                      )}
                      
                    </div>
                    
                    
                  </div>
      </div>
  )
}

export default LoginContainer