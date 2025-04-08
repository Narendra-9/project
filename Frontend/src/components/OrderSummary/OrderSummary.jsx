import React, { useContext } from "react";
import { ReactComponent as BoxIcon } from "../../assets/box.svg";
import { Tooltip } from "@mui/material";
import { ReactComponent as InfoIcon } from "../../assets/info.svg";
import PropTypes from "prop-types";
import { ThemeContext } from "../../context/ThemeContext";
import './OrderSummary.css'
import { formatCurrency } from "../../utils/formatCurrency";

function OrderSummary({
  totalItems,
  totalDiscountedPrice,
  totalBasePrice,
  earnRate,
  pointsUsing,
  orderTotal
}) 
{ 
  const {isPremium}=useContext(ThemeContext)
  return (
    <div className={isPremium?"order-summary-container-component order-summary-premium":"order-summary-container-component"}>
      <div className="order-summary-header-accordian">
        <BoxIcon className="order-summary-box-icon " />
        <p className="order-summary-heading ms-2">
          Order summary ({totalItems} Items)
        </p>
      </div>
      <div className="endava-strength-earn-div">
        <img src="/EScash2.png" height="30px" alt="coin-img"></img>
        <span className="ms-1">
          You will earn &#8377;
          {parseInt((earnRate * totalDiscountedPrice) / 100)} ES Cash on this
          purchase{" "}
        </span>
      </div>
      <div className="order-summary-details">
        <div className="order-summary-row mb-3">
          <span>Price</span>
          <span>&#8377;{formatCurrency(totalBasePrice)}</span>
        </div>
        <div className="order-summary-row mb-3">
          <span>
            Convenience Fee
            <Tooltip
              title={
                <div className="delivery-fee-tool-tip">Delivery Fee : Free</div>
              }
            >
              <InfoIcon className="cart-page-info-icon ms-1" />
            </Tooltip>
          </span>
          <span>&#8377;0</span>
        </div>
        <div className="order-summary-row mb-3">
          <span>
            Discount
            <Tooltip
              title={
                <div className="discount-tool-tip">
                  endava strength Discount : -
                  {totalBasePrice - totalDiscountedPrice}
                </div>
              }
            >
              <InfoIcon className="cart-page-info-icon ms-1" />
            </Tooltip>
          </span>
          <span>-&#8377;{formatCurrency(totalBasePrice - totalDiscountedPrice)}</span>
        </div>

        <div className="order-summary-row mb-3">
          <span>
            ES Cash
            <Tooltip
              title={
                <div className="discount-tool-tip">
                  endava strength Cash : -{pointsUsing}
                </div>
              }
            >
              <InfoIcon className="cart-page-info-icon ms-1" />
            </Tooltip>
          </span>
          <span>-&#8377;{pointsUsing}</span>
        </div>

        <hr className="order-summary-separator"></hr>
        <div className="order-summary-row">
          <span>Total Amount</span>
          <span>&#8377;{formatCurrency(orderTotal)}</span>
        </div>
      </div>
    </div>
  );
}

export default OrderSummary;



// PropTypes for validation
OrderSummary.propTypes = {
  // This will validate that children are passed as a valid number
  totalItems: PropTypes.number.isRequired,
  totalDiscountedPrice: PropTypes.number.isRequired,
  totalBasePrice: PropTypes.number.isRequired,
  earnRate: PropTypes.number.isRequired,
  pointsUsing: PropTypes.number.isRequired,
  orderTotal: PropTypes.number.isRequired,
};