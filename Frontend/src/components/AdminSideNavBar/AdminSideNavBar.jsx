import React, { useContext } from 'react'
import {ReactComponent as PersonIcon} from "../../assets/person.svg"
import {ReactComponent as HomeIcon} from "../../assets/home.svg"
import {ReactComponent as CategoryIcon} from "../../assets/infrastructure.svg"
import {ReactComponent as ProductsIcon} from "../../assets/retail.svg"
import {ReactComponent as ListIcon} from "../../assets/list.svg"
import {ReactComponent as ImageIcon} from "../../assets/Image.svg"
import {ReactComponent as TruckIcon} from "../../assets/transport-and-logistics.svg"
import { useNavigate } from 'react-router-dom';
import LogoutIcon from '@mui/icons-material/Logout';
import { UserConext } from '../../context/UserContext'


function AdminSideNavBar(props) {
  const navigate = useNavigate();
  const {handleLogout}=useContext(UserConext);

  function navigateTo(path){
    navigate(path);
    props.closeMenu();
  }

  return (
    <div className={!props.openMenu?'side-nav':"side-nav opened"}>
        <div className='items-list'>
          <div className='side-nav-item' onClick={()=>navigateTo("/admin/home")}><HomeIcon  className="item-icon"/><span className='item-text'>Home</span></div>
          <div className='side-nav-item' onClick={()=>navigateTo("/admin/add-category")}><CategoryIcon className="item-icon"/><span className='item-text'>Manage Categories</span></div>
          <div className='side-nav-item' onClick={()=>navigateTo("/admin/manage-products")}><ProductsIcon className="item-icon"/><span className='item-text'>Manage Products</span> </div>
          <div className='side-nav-item' onClick={()=>navigateTo("/admin/manage-orders")}><ListIcon className="item-icon"/><span className='item-text'>Manage Orders</span></div>
          <div className='side-nav-item' onClick={()=>navigateTo("/admin/manage-users")}><PersonIcon className="item-icon"/><span className='item-text'>Manage Users</span></div>
          <div className='side-nav-item' onClick={()=>navigateTo("/admin/manage-delivery-locations")}><TruckIcon className="item-icon"/><span className='item-text'>Manage Locations</span></div>       
          <div className='side-nav-item' onClick={()=>navigateTo("/admin/manage-banners")}><ImageIcon className="truck-icon"/><span className='item-text'>Manage Banners</span></div>       
        </div>
        <div className='logout-outer-container'>
          <hr></hr>  
          <div className='side-nav-item logout-item' onClick={handleLogout}><LogoutIcon/> <span className='item-text'>Log Out</span></div>
        </div>
        
    </div>
    
  )
}

export default AdminSideNavBar