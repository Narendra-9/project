import React, { useContext, useEffect, useState } from 'react'
import { UserConext } from '../../context/UserContext'
import axios from 'axios';
import HeadingWithBullet from '../HeadingWithBullet/HeadingWithBullet';
import {ReactComponent as DelteIcon} from "../../assets/trash.svg"
import "./MySavedCards.css"
import Swal from 'sweetalert2';

function MySavedCards() {
    const {user} = useContext(UserConext);
    let [savedCards,setSavedCards]=useState([]);

    useEffect(()=>{
        if(user?.userId){
            async function getAllSavedCardsForUser(){
                let response = await axios.get(`${process.env.REACT_APP_CARD_DETAILS_SERVICE_API}?userId=${user?.userId}`)
                setSavedCards(response.data.body)
            }
            getAllSavedCardsForUser();
        }
    },[user])

    async function deleteSavedCard(cardId){
        const result=await Swal.fire({
                    html:`
                    <div class='swal-div-content'>
                        <p class="sweet-alert-cart-del-msg">Are you sure you want to delete this Card ?</p>
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
                        await axios.delete(`${process.env.REACT_APP_CARD_DETAILS_SERVICE_API}?savedCardId=${cardId}`)
                        setSavedCards(prev=>[...(prev.filter(i=>i.savedCardId!==cardId))]);
                        await Swal.fire({
                            html: `
                                <div class='swal-div-content'>
                                    <p class="sweet-alert-cart-del-msg">Deleted! Your Card has been deleted successfully.</p>
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
                                    <p class="sweet-alert-cart-del-msg">Error!', 'Failed to delete UPI ID. Please try again.</p>
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
    <div className='my-saved-cards mt-5'>
        <HeadingWithBullet heading={"My Saved Cards"}/>
        <div className='profle-page-saved-cards mt-4'>
            {savedCards?.map((card) => {
                return (
                    <div className='profile-page-saved-card me-4'>
                        <div className='profile-page-saved-card-logo'>
                            {card?.cardType==="Visa" && (
                                <img src="https://static1.hkrtcdn.com/mbnext/static/media/common/SecurePayment/visa.svg" alt='card-type' height="25px"></img>
                            )}

                            {card?.cardType==="MasterCard" && (
                                <img src="https://static1.hkrtcdn.com/mbnext/static/media/common/SecurePayment/master.svg" alt='card-type'></img>
                            )}
                        </div>
                        <div className='profile-page-saved-card-cardnumber-div'>
                            <p className='profile-page-saved-card-cardnumber'>{card?.cardNumber}</p>
                        </div>
                        <div className='profile-page-saved-card-delete'>
                            <DelteIcon className="saved-card-delete-icon" onClick={()=>deleteSavedCard(card?.savedCardId)}/>
                        </div>
                    </div>
                )
            })}
            
        </div>
    </div>
  )
}

export default MySavedCards