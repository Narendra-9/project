import React, { useEffect, useState } from 'react'
import "../css/UserProfilePage.css"
import UserEditComponent from '../components/UserEditComponent/UserEditComponent'
import UserOrders from '../components/UserOrders/UserOrders'
import UserAddresses from '../components/UserAddresses/UserAddresses';
import { useLocation } from 'react-router-dom';
import MySavedCards from '../components/MySavedCards/MySavedCards';
import MySavedUpis from '../components/MySavedUpis/MySavedUpis';

function UserProfilePage() {

  let [showContent,setShowContent]=useState("");
  let location=useLocation();
  let stateFromLocation=location.state;

  useEffect(()=>{
    if(stateFromLocation){
      setShowContent(stateFromLocation);
    }
  },[stateFromLocation])

  function showUser(content){
    setShowContent(content);
  }

  return (
    <div className='user-profile-container'>

      <div className='user-profile-navigation'>
        <div className={!(showContent==="myprofile")?'user-navigation-item':'user-navigation-item section-active'} onClick={()=>showUser("myprofile")}>My Profile</div>
        <div className={!(showContent==="myorders")?'user-navigation-item':'user-navigation-item section-active'} onClick={()=>showUser("myorders")}>My Orders</div>
        <div className={!(showContent==="myaddresses")?'user-navigation-item':'user-navigation-item section-active'} onClick={()=>showUser("myaddresses")}>My Addresses</div>
        <div className={!(showContent==="mysavedcards")?'user-navigation-item':'user-navigation-item section-active'} onClick={()=>showUser("mysavedcards")}>My Saved Cards</div>
        <div className={!(showContent==="mysavedupis")?'user-navigation-item':'user-navigation-item section-active'} onClick={()=>showUser("mysavedupis")}>My Saved UPIs</div>
      </div>

      <p className='navigation-line'></p>

      {showContent==="myprofile" && <UserEditComponent/>}
      
      {showContent==="myorders" && <UserOrders/>}

      {showContent==="myaddresses" && <UserAddresses/>}

      {showContent==="mysavedcards" && <MySavedCards/>} 

      {showContent==="mysavedupis" && <MySavedUpis/>}  

    </div>
  )
}

export default UserProfilePage