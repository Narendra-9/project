import React, {useEffect, useState } from 'react'
import "../css/ManageOrders.css"
import styles from "../css/ManageOrdersTable.module.css"
import axios from "axios"
import HeadingWithBullet from '../components/HeadingWithBullet/HeadingWithBullet';
import MyModal from '../components/MyModal/MyModal';
import { TablePagination } from '@mui/material';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import ArrowDropUpIcon from '@mui/icons-material/ArrowDropUp';
import { formatCurrency } from '../utils/formatCurrency'
import { getOrderStatusColor } from '../utils/getOrderStatusColor.js'

function ManageOrders() {
  let [orders,setOrders]=useState([]);
  const [page,setPage]=useState(0);
  const [sort,setSort]=useState("orderId");
  const [sortOrder,setSortOrder]=useState("asc");
  const [show,setShow]=useState(false);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [totalOrders, setTotalOrders] = useState(0);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);
  const [modalContent,setModalContent]=useState({});

  async function getAllPlacedOrders(){
    let response = await axios.get(`${process.env.REACT_APP_ORDER_SERVICE_API}?page=${page}&size=${rowsPerPage}&sort=${sort},${sortOrder}`);
    setOrders(response.data.body.content)
    setTotalOrders(response.data.body.totalElements);
  }

  useEffect(() => {
    getAllPlacedOrders();
  },[page,sort,sortOrder,rowsPerPage])

  function handleSortChange(field){
    setSort(field);
    setSortOrder(sortOrder==="asc"?"desc":"asc");
  }

function formatDate(date) {
  const d = new Date(date);
  
  const day = String(d.getDate()).padStart(2, '0');
  const month = String(d.getMonth() + 1).padStart(2, '0'); 
  const year = d.getFullYear();

  let hours = d.getHours();
  const minutes = String(d.getMinutes()).padStart(2, '0');
  const ampm = hours >= 12 ? 'PM' : 'AM';

  hours = hours % 12 || 12;

  return `${day}/${month}/${year} , ${hours}:${minutes} ${ampm}`;
}


function handleChangeRowsPerPage(event) {
  setRowsPerPage(parseInt(event.target.value, 10));
  setPage(0); 
}

function handleChangePage(event, newPage) {
  setPage(newPage);
}

function openPopUp(order){
  setModalContent(order)
  handleShow();
}

  return (
    <div className='manage-orders'>

    <MyModal show={show} modalContent={modalContent} handleShow={handleShow} handleClose={handleClose}/>
    <HeadingWithBullet heading={"Manage Orders"}/>

    <p style={{margin:"0px",marginTop:"20px"}}>Note : Click on any record to view details</p>
    
      <table className={styles.table}>
        <thead>
          <tr >
            <th onClick={()=>handleSortChange("orderId")} style={{cursor:"pointer"}}>Order Id <ArrowDropDownIcon/></th>
            <th>User Name</th>
            <th onClick={()=>handleSortChange("totalPrice")} style={{cursor:"pointer"}}>Order Amount <ArrowDropDownIcon/></th>
            <th onClick={()=>handleSortChange("createdAt")} style={{cursor:"pointer"}}>Order Date <ArrowDropDownIcon/></th>
            <th>Order Status</th>
          </tr>
        </thead>
        <tbody>
            {orders?.map((order,index) => {
              return (
                <tr key={index} className={styles.tablebodytr} onClick={()=>openPopUp(order)}>
                  <td>{order?.orderId}</td>
                  <td className={styles.fullName}>{order?.userAddress?.fullName}</td>
                  <td>{formatCurrency(order?.totalOrderAmount) || 0}</td>
                  <td style={{textAlign:"center"}}>{formatDate(order?.createdAt)}</td>
                  <td style={{ fontWeight: "bold", color: "red" }}>
                  {order?.orderStatus}
                  </td>
                </tr>
              )
            })}
        </tbody>
      </table>
      
      <TablePagination
        component="div"
        count={totalOrders}
        page={page}
        onPageChange={handleChangePage}
        rowsPerPage={rowsPerPage}
        onRowsPerPageChange={handleChangeRowsPerPage}
        rowsPerPageOptions={[5, 10, 20, 50]} 
        sx={{
          backgroundColor:"#5E6A73",
          color: "white",
          display: "flex",
          justifyContent: "flex-end",
          "& .MuiTablePagination-toolbar": {
            display: "flex",
            alignItems: "center", 
          },
          "& .MuiTablePagination-selectLabel, & .MuiTablePagination-displayedRows": {
            marginBottom: "0px", 
          },
          "& .MuiTablePagination-select": {
            color: "white",
          },
          "& .MuiTablePagination-actions button": {
            color: "white", 
          },
        }}
      />
      
    </div>
  )
}

export default ManageOrders