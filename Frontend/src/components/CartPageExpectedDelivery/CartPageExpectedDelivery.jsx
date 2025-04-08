import React from 'react'
import PropTypes from "prop-types"; 
import {ReactComponent as TruckIcon} from "../../assets/transport-and-logistics.svg"
import "./CartPageExpectedDelivery.css"

function CartPageExpectedDelivery(props) {
    function addDays(days) {
        const newDate = new Date();
        newDate.setDate(newDate.getDate() + days);
        return newDate;
      }
    
      function getExpectedDeliveryDate() {
        let expectedDeliveyDate = addDays(props.expectedDelivey);
        let day = expectedDeliveyDate.getDate();
        let dayName = expectedDeliveyDate.toLocaleDateString("en-US", {
          weekday: "long",
        });
        let monthName = expectedDeliveyDate.toLocaleDateString("en-US", {
          month: "long",
        });
        let wantedFormat = `${dayName.slice(0, 3)}, ${day} ${monthName.slice(
          0,
          3
        )}`;
        return wantedFormat;
      }
    
      return (
        <div className="cart-page-expected-delivery-content">
          <TruckIcon className="cart-page-truck-icon"/>
          <span className="ms-1">Delivery by {getExpectedDeliveryDate()}</span>
        </div>
      );
}

CartPageExpectedDelivery.propTypes = {
  expectedDelivey: PropTypes.number.isRequired, 
};

export default CartPageExpectedDelivery