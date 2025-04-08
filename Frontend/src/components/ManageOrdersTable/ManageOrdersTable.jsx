import React, { useState } from 'react'

function ManageOrdersTable() {
    let [orders,setOrders]=useState([]);
    const [page,setPage]=useState(0);
    const [sort,setSort]=useState("orderId");
    const [sortOrder,setSortOrder]=useState("asc");
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [totalOrders, setTotalOrders] = useState(0);

    
    function formatDateTime(date) {
        const d = new Date(date);
        
        const day = String(d.getDate()).padStart(2, '0');
        const month = String(d.getMonth() + 1).padStart(2, '0'); 
        const year = d.getFullYear();
      
        let hours = d.getHours();
        const minutes = String(d.getMinutes()).padStart(2, '0');
        const ampm = hours >= 12 ? 'PM' : 'AM';
      
        hours = hours % 12 || 12;
      
        return `${day}/${month}/${year}`;
    }


    function handleChangeRowsPerPage(event) {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0); // Reset to first page when changing rows per page
    }


  return (
    <div>ManageOrdersTable</div>
  )
}

export default ManageOrdersTable