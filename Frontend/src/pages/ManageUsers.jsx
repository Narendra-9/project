import axios from 'axios';
import React, { useEffect, useState } from 'react'
import DataTable from "react-data-table-component"
import toast from 'react-hot-toast';
import HeadingWithBullet from '../components/HeadingWithBullet/HeadingWithBullet';
import "../css/ManageUsers.css"
import MyCustomLoader from '../components/MyCustomLoader/MyCustomLoader';
import showToast from '../components/CustomToast/CustomToast';

const customStyles = {
  headCells: {
    style: {
      backgroundColor: "#30404B",
      color: "white",
      fontSize: "16px",
      fontWeight: "bold",
      justifyContent: "center",
      textAlign:"center",
    },
  },
  rows: {
    style: {
      backgroundColor: "#37424B",
      fontSize: "14px",
      color:"white",
    },
  },
  cells:{
    style:{
      justifyContent: "justify",
      // textAlign:"center",
      padding:"10px"
    }
  },
  pagination: {
    style: {
      backgroundColor: "#5E6A73",  
      borderTop: "1px solid #ddd",
      padding: "10px",
      color:"white"
    },
    pageButtonsStyle: {
      color:"#FF5640", 
      fill: "#FF5640", 
      fontSize: "14px",
      borderRadius: "50px",
    },
  },
};

function ManageUsers() {
  let [users,setUsers]=useState([])
  const [loading, setLoading] = useState(true);
  const [toggleActionLoading,setToggleActionLoading]=useState(false);

  // ! Function to fetch Users.
  async function getAllUsersData(){
    try{
      let response=await axios.get(`${process.env.REACT_APP_GET_ALL_USERS_DATA}`)
      setUsers(response.data.body)
      setLoading(false)
    }
    catch(err){
      toast.error("Something went wrong !")
      setLoading(false)
    }
  }

  // ! Getting the users when component mounts.
  useEffect(()=>{
    getAllUsersData();
  },[])

  // ! Function to toggle User's State.
  async function toggleActive(userId){
    try{
      // Setting the toggleLoading to make user there is no multiple clicks at a time
      setToggleActionLoading(true);

      // Instead of fetching users again, toggling the state dynamically.
      setUsers((prevUsers) =>
        prevUsers.map((user) =>
          user.userId === userId ? { ...user, active: !user.active } : user
        )
      );

      
      await axios.put(
        `${process.env.REACT_APP_USERS_SERVICE_API}/toggleActive?userId=${userId}`,
        {
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
          },
        }
      );

    // Showing toast message based on the updated state
    const updatedUser = users.find((user) => user.userId === userId);
    showToast(!updatedUser.active ? "User Activated" : "User Deactivated");
    }
    catch(error){
      showToast("Something Went Wrong","error");
      console.error("Error Toggling User's State ", error);

      // If error occurred, I am reverting back the made changes.
      setUsers((prevUsers) =>
        prevUsers.map((user) =>
          user.userId === userId ? { ...user, active: !user.active } : user
        )
      );
    }
    finally{
      setToggleActionLoading(false);
    }
  }
  
  const columns=[

    {
      name:"U Id",
      selector:row=>row.userId,
      width:"70px",
      center:true,
      fixed: "left",
      style: {
        position: "sticky",
        left: 0,
        backgroundColor: "#30404B", 
        zIndex: 2,
      },
    },
    {
      name:"User Name",
      selector:row=>row.userName || "-",
    },
    {
      name:"User Email",
      selector:row=>row.userEmail,
      center:true,
    },
    {
      name:"Gender",
      selector:row=>row.gender || "-",
      center:true,
    },
    {
      name:"Phone No.",
      selector:row=>row.phoneNumber || "-",
      center:true,
    },
    {
      name:"Ordered Amount",
      selector:row=>row.orderedAmount,
      center:true,
      sortable:true,
      width:"200px",
    },
    {
      name:"Orders Placed",
      selector:row=>row.noOfOrdersPlaced,
      center:true,
      sortable:true,
      width:"200px",
    },
    {
      name: "Premium Status",
      selector: (row) => row.premiumActive,
      center: true,
      cell: (row) => (
        <span>
          {row.premiumActive ? <span className='premium-status'>👑</span> : "🔴"}
        </span>
      ),
      width: "200px",
    },
    {
      name:"IsLoggedIn",
      selector:row=>row.loggedIn.toString(),
      center:true,
      cell:(row)=>(
        <span>
          {row.loggedIn?"🟢":"🔴"}
        </span>
      )
    },
    {
      name:"ES Cash Points",
      selector:row=>row.esCashPoints,
      center:true,
      width:"200px",
    },
    {
      name:"IsActive",
      selector:row=>row.active.toString(),
      center:true,
      cell:(row)=>(
        <span>
          {row.active?"🟢":"🔴"}
        </span>
      ),
      width:"200px",
    },
    {
      name:"Actions",
      selector:row=>row.active.toString(),
      center:true,
      cell:(row)=>(
        <span>
          {row.active?
          <button className='admin-user-deactivate-btn' disabled={toggleActionLoading} onClick={()=>toggleActive(row.userId)}>Deactivate</button>:
          <button className='admin-user-activate-btn' disabled={toggleActionLoading} onClick={()=>toggleActive(row.userId)}>Activate</button>}
        </span>
      ),
      width:"200px",
    },
  ]

  
  return (
    <div className='users-table'>
        <div><HeadingWithBullet heading={"Manage Users"}/></div>
        <div className='mt-5'></div>
        {loading ? (
          <MyCustomLoader text={"loading users"}/>
      ) : (
        <DataTable columns={columns} data={users} customStyles={customStyles} pagination />
      )}

    </div>
  )
}

export default ManageUsers