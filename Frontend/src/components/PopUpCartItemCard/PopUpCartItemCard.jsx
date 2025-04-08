import React, { useContext } from 'react'
import "./PopUpCartItem.css"
import {ReactComponent as DeleteIcon} from "../../assets/trash.svg"
import { CartContext } from '../../context/CartContext'
import { ThemeContext } from '../../context/ThemeContext';

function PopUpCartItemCard(props) {
    const {deleteFromCart}=useContext(CartContext);
    const {isPremium}=useContext(ThemeContext)
    const {imgUrl,productName,productId}=props
  return (
    <div className={isPremium?'popup-cart-item-card-premium mb-3':'popup-cart-item-card mb-3'}>
        <div className='popup-cart-item-img-container'>
            <img src={imgUrl} alt='product-img' height="100px"></img>
        </div>
        <div className='popup-cart-item-details-container'>
            <p className='popup-cart-item-name'>{productName}</p>
            <div className='popup-cart-item-delete-btn-div'>
                <button className='popup-cart-delete-btn' onClick={()=>deleteFromCart(productId)}><DeleteIcon className="popup-cart-delete-btn-icon"/></button>
            </div>
        </div>
    </div>
  )
}

export default PopUpCartItemCard