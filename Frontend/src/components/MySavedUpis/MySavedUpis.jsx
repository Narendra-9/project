import React, { useContext, useEffect, useState } from 'react'
import "./MySavedUpis.css"
import { UserConext } from '../../context/UserContext'
import axios from 'axios';
import gpayLogo from '../../assets/Gpay_logo.png'
import phonepeLogo from '../../assets/Phonepe_logo.png'
import paytmLogo from '../../assets/Paytm_logo.jpg'
import HeadingWithBullet from '../HeadingWithBullet/HeadingWithBullet';
import {ReactComponent as DelteIcon} from "../../assets/trash.svg"
import Swal from 'sweetalert2';

function MySavedUpis() {
    const {user}=useContext(UserConext);
    let [savedUpis,setSavedUpis]=useState([]);

    useEffect(()=>{
        if(user?.userId){
            async function getAllSavedUpiidsForUser(){
                let response = await axios.get(`${process.env.REACT_APP_UPI_DETAILS_SERVICE_API}?userId=${user?.userId}`)
                setSavedUpis(response.data.body)
            }
            getAllSavedUpiidsForUser();
        }
    },[user])

    const getUpiLogo = (upiId) => {
        if (upiId.includes('@okhdfcbank') || upiId.includes('@oksbi') || upiId.includes('@okicici')) {
            return gpayLogo;
        } else if (upiId.includes('@ybl')) {
            return phonepeLogo;
        } else if (upiId.includes('@paytm')) {
            return paytmLogo;
        }
        return null;
    };

    async function deleteSavedUPI(upiId){
        const result=await Swal.fire({
                    html:`
                    <div class='swal-div-content'>
                        <p class="sweet-alert-cart-del-msg">Are you sure you want to delete this UPI ID ?</p>
                    </div>
                    `,
                    showDenyButton: true,
                    denyButtonText: "Cancel",
                    confirmButtonText: "Delete",
                    customClass: {
                    popup: 'custom-popup',  
                    confirmButton: 'custom-confirm-button',
                    denyButton: 'custom-deny-button', 
                },
                })
                
                if(result.isConfirmed){
                    try{
                        await axios.delete(`${process.env.REACT_APP_SAVED_UPI_SERVICE}?savedUpiId=${upiId}`)
                        setSavedUpis(prev=>[...(prev.filter(i=>i.savedUpiId!==upiId))]);
                        await Swal.fire({
                            html: `
                                <div class='swal-div-content'>
                                    <p class="sweet-alert-cart-del-msg">Deleted! Your UPI ID has been deleted successfully.</p>
                                </div>
                            `,
                            icon: 'success',
                            customClass: {
                                popup: 'custom-popup',  
                                confirmButton: 'custom-confirm-button'
                            },
                            confirmButtonText: "OK"
                        });                        
                    }
                    catch(err){
                        await Swal.fire({
                            html: `
                                <div class='swal-div-content'>
                                    <p class="sweet-alert-cart-del-msg">Failed to delete UPI ID. Please try again.</p>
                                </div>
                            `,
                            icon: 'success',
                            customClass: {
                                popup: 'custom-popup',  
                                confirmButton: 'custom-confirm-button'
                            },
                            confirmButtonText: "OK"
                        }); 
                    }
                }
    }

return (
    <div className='my-saved-upis mt-5'>
        <HeadingWithBullet heading={"My Saved UPI"}/>

        <div className='profile-page-saved-upi-container mt-4'>

            {savedUpis?.map(savedUpi=>{
                return (
                    <div className='profile-page-saved-upi me-2'>
                        <div className='saved-upi-logo'>
                            <img className='upi-app-logo' src={getUpiLogo(savedUpi?.maskedUpiId)} alt='upi-logo'></img>
                        </div>
                        <p>{savedUpi?.maskedUpiId}</p>

                        <div className='saved-upi-delete-div'>
                            <DelteIcon className="saved-upi-delete-btn" onClick={()=>deleteSavedUPI(savedUpi.savedUpiId)}/>
                        </div>

                    </div>
                )
            })}

        </div>
    </div>
  )
}

export default MySavedUpis