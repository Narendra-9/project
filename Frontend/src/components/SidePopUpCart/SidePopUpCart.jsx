import React, { useContext } from "react";
import "./SidePopUpCart.css";
import PopUpCartItemCard from "../PopUpCartItemCard/PopUpCartItemCard";
import { ReactComponent as CloseIcon } from "../../assets/close.svg";
import { CartContext } from "../../context/CartContext";
import { motion } from "motion/react";
import { useNavigate } from "react-router-dom";
import { ThemeContext } from "../../context/ThemeContext";

function SidePopUpCart() {
  const { cart, closeSideCart } = useContext(CartContext);
  const { isPremium } = useContext(ThemeContext);
  let navigate = useNavigate();

  let totalDiscountedPrice = cart?.cartItems.reduce((total, item) => {
    return total + item?.product?.discoutedPrice * item?.quantity;
  }, 0);
  return (
    <motion.div
      initial={{ y: 500 }}
      whileInView={{
        y: 0,
      }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
      className={
        isPremium
          ? "side-popup-cart-container-premium"
          : "side-popup-cart-container"
      }
    >
      <div className="side-cart-close-btn-div">
        <CloseIcon className="side-cart-close-icon" onClick={closeSideCart} />
      </div>
      <div className="side-cart-items">
        {cart?.cartItems?.map((item, index) => {
          return (
            <PopUpCartItemCard
              key={index}
              productId={item.product.productId}
              imgUrl={item?.product?.primaryImageUrl}
              productName={item.product.productName}
            />
          );
        })}
      </div>
      <div className="side-cart-sub-total-div p-3">
        <p>
          SubTotal <span>&#8377;{totalDiscountedPrice}</span>
        </p>
        <button
          className="side-cart-checkout-btn"
          onClick={() => navigate("/users/mycart")}
        >
          CHECKOUT
        </button>
      </div>
    </motion.div>
  );
}

export default SidePopUpCart;
