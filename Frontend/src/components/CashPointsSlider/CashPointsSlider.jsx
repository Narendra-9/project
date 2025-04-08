import { Slider } from "@mui/material";
import React, { useContext, useEffect, useState } from "react";
import styles from "./CashPointsSlider.module.css"
import { UserConext } from "../../context/UserContext";
import {ReactComponent as InfoIcon} from "../../assets/info.svg"
import Tooltip from '@mui/material/Tooltip';

function CashPointsSlider({orderTotal,onChange}) {
    const {user}=useContext(UserConext);
    const maxRedeemable=Math.min(user?.esCashPoints,parseInt(orderTotal*0.3));
    const [points,setPoints]=useState(0);
    function handleSliderChange(e){
        setPoints(e.target.value);
        onChange(e.target.value);
    }

    if(maxRedeemable===0){
        return 
    }
    
  return (
    <div className={styles.cashPointsSlider}>
    <p>
                        <span>ES Cash
                        <Tooltip title={<div className='discount-tool-tip'>endava strength Cash : -{points}</div>}>
                        <InfoIcon className="cart-page-info-icon ms-1"/>
                        </Tooltip>
                        </span></p>
    <p className={styles.esChashLabel}>
    <span className={styles.userInfo}>You can use upto &#8377;{maxRedeemable}</span>
    <span className={styles.esCash}>-<img className="ms-1 me-1" src="/Escash2.png" alt="cash-icon" height="15px" width="auto"></img>{points}</span>
    </p>
    <div className={styles.slider}>
        <Slider
            size="small"
            aria-label="Small"
            valueLabelDisplay="auto"
            value={points}
            sx={{
                padding:"0"
            }}
            min={0}
            max={maxRedeemable}
            onChange={handleSliderChange}
        />
    </div>
    </div>
  );
}

export default CashPointsSlider;
