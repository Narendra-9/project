import React, { useCallback, useContext, useEffect, useState } from 'react'
import "../css/LoylalityPage.css"
import {ReactComponent as PremiumIcon} from "../assets/premium-icon.svg"
import Slider from '@mui/material/Slider';
import Divider from '@mui/material/Divider';
import Accordion from '@mui/material/Accordion';
import AccordionActions from '@mui/material/AccordionActions';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import Typography from '@mui/material/Typography';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import TaskAltIcon from '@mui/icons-material/TaskAlt';
import axios from 'axios';
import { UserConext } from '../context/UserContext';
import toast from 'react-hot-toast';
import { LABELS } from '../config/labels';
import { CartContext } from '../context/CartContext';


function LoyalityPage() {
  
  const {user}=useContext(UserConext);
  const {addToCart}=useContext(CartContext)
  const [totalSpent,setTotalSpent]=useState(0);
  const PREMIUM_THRESHOLD = 10000; 

  const getTotalSpentByUser = useCallback(async () => {
    if (!user) {
      setTotalSpent(0);
      return;
    }
    try {
      const response = await axios.get(`${process.env.REACT_APP_ORDER_SERVICE_API}/totalSpentByUser?userId=${user.userId}`);
      setTotalSpent(response.data.body);
    } catch (error) {
      toast.error(LABELS.errorFetchingTotalSpent);
    }
  }, [user]);

  useEffect(() => {
    getTotalSpentByUser();
  }, [getTotalSpentByUser]);

  return (
    <div className='loyality-page-container'>
            <div className='endava-strength-premium-content-container'>

                <div className='es-logo-container'>
                    <img src="/endava_strength_logo.png" alt='endava-strength' height="auto" width="250px"></img>
                    <PremiumIcon className="premium-icon mt-3"/>
                </div>

                <div className='custom-loyality-divider'></div>

                <div className='premium-details-container'>
                    <div className='exclusive-benefits'>
                      <Accordion defaultExpanded className='exclusive-benefits-accordian'>
                        <AccordionSummary
                          expandIcon={<ExpandMoreIcon sx={{color:"white"}}/>}
                          aria-controls="panel3-content"
                          id="panel3-header"
                        >
                        <Typography component="span" sx={{fontSize:"20px"}}>Exclusive Benefits & Savings</Typography>
                        </AccordionSummary>
                      <AccordionDetails>
                        <p><TaskAltIcon className='me-2' sx={{color:"gold"}}/>Flat 3% extra discount on select products</p>
                        <p><TaskAltIcon className='me-2' sx={{color:"gold"}}/>Additional saving on launch offers</p>
                        <p><TaskAltIcon className='me-2' sx={{color:"gold"}}/>Free delivery on all orders</p>
                      </AccordionDetails>
                      <AccordionActions sx={{backgroundColor:"black",padding:"0",display:"flex",justifyContent:"center"}}>
                        <p style={{margin:"0"}}>T&C Applicable</p>
                      </AccordionActions>
                      </Accordion>
                    </div>

                      <div className='premium-buy-now-div mt-2'>
                        <Slider disabled 
                        value={totalSpent}
                        min={0}
                        max={PREMIUM_THRESHOLD} 
                        aria-label="Disabled slider" />
                        
                        <p className='loyality-range'><span>&#8377;0</span><span>&#8377;{PREMIUM_THRESHOLD}</span></p>
                        {totalSpent<PREMIUM_THRESHOLD ? (
                          <p className='mt-3'>Shop for &#8377;{PREMIUM_THRESHOLD-totalSpent} more to get <span><PremiumIcon className="premium-iconn"/></span> free</p>
                          ) : (
                          <p className='mt-3 text-center'>You Already Availed your free <span><PremiumIcon className="premium-iconn"/></span></p>
                          )}

                        <Divider style={{width:"80%",margin:"auto"}}>or</Divider>
                        <p className='text-center mt-3'>Get <span><PremiumIcon className="premium-iconn"/></span> Benefits for &#8377;299</p>
                        <button className='loyality-buy-now-btn' onClick={()=>addToCart(12,1)}>Buy Now @299</button>
                      </div>

                </div>
            </div>
    </div>
  )
}

export default LoyalityPage