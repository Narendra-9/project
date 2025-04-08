import React, { useContext } from 'react'
import {  useNavigate } from 'react-router-dom';
import { CartContext } from '../../context/CartContext';
import "./ProductCard.css"
import {ReactComponent as PremiumIcon} from "../../assets/premium-icon.svg"
import {ReactComponent as BellIcon} from "../../assets/notification.svg"
import StarIcon from '@mui/icons-material/Star';
import PropTypes from 'prop-types';
import { ThemeContext } from '../../context/ThemeContext';


function ProductCard({stockQuantity,productName,imgURL,discountedPrice,basePrice,productId,slug,avgRating}) {
    const {addToCart,premiumOffer,addToWishList,handleNotify}=useContext(CartContext);
    const {isPremium}=useContext(ThemeContext);

    let navigate=useNavigate();

    let productNameSplitArray=productName.split(",");

    function goToPremiumPage(e){
        e.stopPropagation();
        navigate("/loyality");
    }


  return (
    <div className={isPremium?"product-card product-card-premium":"product-card"}>
    <div className='product-card-offer'>
        {isPremium ? (<img src='/OfferTag.png' alt='offer-banner' height="60px"></img>):(
            <img src='/OfferTagNormal.png' alt='offer-banner' height="60px"></img>
        )}
        
        <p className='product-card-discount'>{parseInt(((basePrice-discountedPrice)/basePrice)*100)}% <br></br>OFF</p>
    </div>
    <div className='product-content' onClick={()=>navigate(`/products/${slug}`)}>
        <div className='product-img-container'>
            <img src={imgURL} alt='product-img' className='product-img'></img>
        </div>
        <div className='product-details'>
            <p className='product-card-product-name'>{productNameSplitArray[0]}</p>
            <p className='product-card-product-varient-name'>{productNameSplitArray[1]} | {productNameSplitArray[2]}</p>
            <p className='price'>
                Rs.{discountedPrice}
                <span className='product-base-price'>Rs.{basePrice}</span>
                <span className='amount-saved ms-2'>Save Rs.{basePrice-discountedPrice}</span>
            </p>
            <div className='prouduct-card-premium-price' onClick={goToPremiumPage}><span style={{fontSize:"16px"}}>Rs.{parseInt(discountedPrice-(premiumOffer*discountedPrice)/100)}</span><span style={{color:"grey",fontSize:"14px",marginLeft:"3px"}}>with</span><PremiumIcon className="product-card-premium-icon ms-1" /></div>

            
            <div className='product-card-rating-and-stock'>
                <div className='product-card-rating mt-2'> 
                    <span>{avgRating}</span><StarIcon style={{height:"18px"}}/>
                </div>
                {(stockQuantity<5 && stockQuantity!==0) && <p className='product-card-stock-left' style={{display:"flex",alignItems:"center",alignContent:"center"}}><span>⚠️</span><span className='mt-1'>Hurry, Only {stockQuantity} left in stock</span></p>}
                {(stockQuantity<10 && stockQuantity>=5)  && <p className='product-card-stock-left'>Limited Stock Available!</p>}
                {(stockQuantity===0)  && <p className='product-card-stock-left'>Out Of Stock</p>} 
            </div>
        </div>
    </div>
    <hr className={isPremium?'product-card-separator-premium product-card-separator':'product-card-separator'}></hr>
    <div className='product-buttons row mt-3'>
    <div className='col'>
        <button className='buy-now-button' onClick={()=>addToWishList(productId)}>ADD TO WISHLIST</button>
    </div>
    <div className='col'>
        {stockQuantity===0 ? (
            <button className='add-to-cart-button card-notify-me' onClick={()=>handleNotify(productId)}><BellIcon className='card-bell-icon me-2'/> <span>NOTIFY ME</span></button>
        ) : (
            <button className='add-to-cart-button' onClick={()=>addToCart(productId,1)}>ADD TO CART</button>
        )}
        
        {/* <button className={stockQuantity===0?'add-to-cart-button p-page-add-disable':'add-to-cart-button'} disabled={stockQuantity===0} onClick={()=>addToCart(productId,1)}>{stockQuantity===0?"Out of Energy!":"ADD TO CART"}</button> */}
    </div>
    </div>
    </div>
  )
}

ProductCard.propTypes = {
    stockQuantity: PropTypes.number,
    productName: PropTypes.string,
    imgURL: PropTypes.string,
    discountedPrice: PropTypes.number,
    basePrice: PropTypes.number,
    productId: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
    slug: PropTypes.string.isRequired
};

export default ProductCard



