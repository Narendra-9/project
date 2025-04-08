import React, { useContext } from "react";
import { ReactComponent as PremiumIcon } from "../../assets/premium-icon.svg";
import "./VerticalProductCard.css"
import { CartContext } from "../../context/CartContext";
import { ThemeContext } from "../../context/ThemeContext";
import { useNavigate } from "react-router-dom";
import StarIcon from '@mui/icons-material/Star';

function VerticalProductCard({product}) {
    const {addToCart}=useContext(CartContext);
    const {isPremium}=useContext(ThemeContext)
    let splittedProductName=product?.productName?.split(",");
    const navigate=useNavigate();

  return (
    <div className={isPremium?"product-card-vertical me-4 product-card-vertical-premium-theme":"product-card-vertical me-4"}>
      
      <div className="vertical-card-offer-tag">
        {isPremium ? (
          <img src="/OfferTag.png" alt="offer-tag" height="60px"></img>
        ) : (
          <img src="/OfferTagNormal.png" alt="offer-tag" height="60px"></img>

        )}
        <p className="vertical-card-offer-value">{parseInt(((product.basePrice-product.discoutedPrice)/product.basePrice)*100)}% <br></br>OFF</p>
      </div>
      
      <div className="product-card-vertical-img-div" onClick={()=>navigate(`/products/${product?.slug}`)}>
        <img
          className="product-card-vertical-img"
          src={product?.primaryImageUrl}
          alt="shirt-img"
        ></img>

        <div className='vertical-product-card-rating mt-2'> 
            <span>{product?.avgRating}</span><StarIcon style={{height:"18px"}}/>
        </div>
      </div>
      <p className="product-card-vertical-product-name">
        {splittedProductName[0]}
      </p>
      <p className="product-card-vertical-product-varient">{splittedProductName[1]} | {splittedProductName[2]}</p>
      <p className="product-card-vertical-price">
        <span className="prduct-card-vertical-discount-price">&#8377;{product.discoutedPrice}</span>
        <span className="product-card-vertical-base-price ms-1">
          &#8377;{product.basePrice}
        </span>
        <span className="product-card-save-price ms-2">Save &#8377; {product.basePrice-product.discoutedPrice}</span>
      </p>
      <p className="product-card-vertical-premium">
        <span className="product-card-vertical-premium-price">&#8377;{parseInt(0.97*(product.discoutedPrice))}</span>
        <span className="ms-1">with</span>
        <PremiumIcon className="ms-2 product-card-vertical-premium-icon" />
      </p>
      
      <button className="product-card-vertical-add-to-cart-btn" onClick={()=>addToCart(product.productId,1)}>
        ADD TO CART
      </button>
    </div>
  );
}

export default VerticalProductCard;
