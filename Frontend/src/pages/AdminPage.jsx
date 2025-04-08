import React, { useEffect, useState } from 'react'
import { motion } from "motion/react"
import HeadingWithBullet from "../components/HeadingWithBullet/HeadingWithBullet"
import "../css/AdminPage.css"
import PersonOutlineIcon from '@mui/icons-material/PersonOutline';
import AdminStatCard from '../components/AdminStatCard/AdminStatCard';
import axios from 'axios'
import CurrencyFormatter from '../components/CurrencyFormatter/CurrencyFormatter';
import useWebSocket from '../components/UseWebSocket/UseWebSocket';

function AdminPage() {

  let [adminStat,setAdminStat]=useState(null);
  let [loading,setLoading]=useState(true);
  const notifications = useWebSocket();

  async function getStats(){
    try{
      let response=await axios.get(process.env.REACT_APP_GET_STATS);
      setAdminStat(response.data.body);
      setLoading(false)
    }catch(err){
      console.log(err);
      setLoading(false)
    }
    
  }
  console.log(notifications)
  useEffect(()=>{
    getStats()
  },[])

  useEffect(()=>{
    if(adminStat){
      setAdminStat({...adminStat,totalOrders: adminStat.totalOrders+1});
    }
  },[notifications])

  if (loading) {
    return <div>Loading...</div>; 
  }
  


  return (
    <div className='admin-page-body'>
      <div className='container dashboard-container' style={{marginTop:"100px"}}>
        <motion.h1 
        initial={{ opacity: 0, x: -80 }}
            whileInView={{
              opacity: 1,
              x: 0,
            }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
        className='text-center mb-4' style={{color:"#ff5640"}}>Admin DashBoard</motion.h1>

        <HeadingWithBullet heading={"User Statistics"}/>

        <div className='stat-card-container'>
          <AdminStatCard count={adminStat?.totalUsers} name={"Total Users"} Icon={PersonOutlineIcon}/>
          <AdminStatCard count={adminStat?.newRegistrations} name={"New Registrations"} Icon={PersonOutlineIcon}/>
        </div>
        
        <HeadingWithBullet heading={"Order Statistics"}/>

        <div className='stat-card-container'>
          <AdminStatCard count={adminStat?.totalOrders} name={"Total Orders"} Icon={PersonOutlineIcon}/>
          <AdminStatCard count={adminStat?.pendingOrders} name={"Pending Orders"} Icon={PersonOutlineIcon}/>
          <AdminStatCard count={adminStat?.processedOrders} name={"Processed Orders"} Icon={PersonOutlineIcon}/>
          <AdminStatCard count={adminStat?.canceledOrders} name={"Canceled Orders"} Icon={PersonOutlineIcon}/>
        </div>

        <HeadingWithBullet heading={"Sales Statistics"}/>

        
        <div className='stat-card-container'>
          <AdminStatCard count={<CurrencyFormatter amount={adminStat?.totalRevenue}/>} name={"Total Revenue"} Icon={PersonOutlineIcon}/>
          <AdminStatCard count={<CurrencyFormatter amount={adminStat?.todayRevenue}/>} name={"Today's Revenue"} Icon={PersonOutlineIcon}/>
        </div>
        <HeadingWithBullet heading={"Payment Statistics"}/>

        <div className='stat-card-container'>
          <AdminStatCard count={adminStat?.totalPaymentsProcessed} name={"Total Payments Processed"} Icon={PersonOutlineIcon}/>
          <AdminStatCard count={adminStat?.failedPayments} name={"Failed Payments"} Icon={PersonOutlineIcon}/>
        </div>
        <HeadingWithBullet heading={"Inventory Data"}/>
        <div className='stat-card-container'>
          <AdminStatCard count={adminStat?.totalProducts} name={"Total Products"} Icon={PersonOutlineIcon}/>
          <AdminStatCard count={adminStat?.lowStockProducts} name={"Low Stock Products"} Icon={PersonOutlineIcon}/>
        </div>
      </div>
    </div>
    
  )
}

export default AdminPage