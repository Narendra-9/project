import React, { useContext } from 'react'
import {ReactComponent as PersonIcon} from "../../assets/person.svg"
import {ReactComponent as TruckIcon} from "../../assets/transport-and-logistics.svg"
import {ReactComponent as HomeIcon} from "../../assets/home.svg"
import {ReactComponent as CardIcon} from "../../assets/credit-card.svg"
import {ReactComponent as MoneyIcon} from "../../assets/money.svg"
import {ReactComponent as Loyality} from "../../assets/private-equity.svg"
import "./UserOptions.css"
import { useNavigate } from 'react-router-dom'
import { UserConext } from '../../context/UserContext'
import { ThemeContext } from '../../context/ThemeContext'
function UserOptions(props) {
    let navigate=useNavigate();
    const {handleLogout}=useContext(UserConext);
    const {toggleOptions}=props
    const {isPremium}=useContext(ThemeContext)
    
    function handleClick(event) {
        event.stopPropagation();
      }

    function handleOptionClick(section){
      navigate("/account/MyAccount",{state:section});
      toggleOptions();
    }
  return (
    <div className={isPremium?"user-options user-options-premium":"user-options"} onClick={handleClick} onMouseLeave={toggleOptions}>
        <div className='user-option item-icon' onClick={()=>handleOptionClick("myprofile")}><PersonIcon className="user-option-icon "/><span className='user-option-text'>My Profile</span></div>
        <p className='user-option-divider'></p>
        <div className='user-option item-icon' onClick={()=>handleOptionClick("myorders")}><TruckIcon className="user-option-icon"/><span className='user-option-text'>My Orders</span></div>
        <p className='user-option-divider'></p>
        <div className='user-option item-icon' onClick={()=>handleOptionClick("myaddresses")}><HomeIcon className="user-option-icon"/><span className='user-option-text'>My Addresses</span></div>
        <p className='user-option-divider'></p>
        <div className='user-option item-icon' onClick={()=>handleOptionClick("mysavedcards")}><CardIcon className="user-option-icon"/><span className='user-option-text'>My Saved Cards</span></div>
        <p className='user-option-divider'></p>
        <div className='user-option item-icon' onClick={()=>handleOptionClick("mysavedupis")}><MoneyIcon className="user-option-icon"/><span className='user-option-text'>My Saved UPIs</span></div>
        <p className='user-option-divider'></p>
        <div className='user-option item-icon' onClick={()=>{navigate("/loyality");toggleOptions();}}><Loyality className="user-option-icon"/><span className='user-option-text'>Loyality</span></div>
        <p className='user-option-divider'></p>
        <div className='log-out-div'><button className='logout-btn' onClick={handleLogout}>Log Out</button></div>
    </div>
  )
}

export default UserOptions