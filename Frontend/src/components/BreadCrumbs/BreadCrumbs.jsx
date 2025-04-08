import React from 'react'
import Typography from '@mui/material/Typography';
import Breadcrumbs from '@mui/material/Breadcrumbs';
import { Link } from 'react-router-dom';
function BreadCrumbs(props) {
    if(Object.keys(props).length===3){
        return (
        <Breadcrumbs aria-label="breadcrumb" style={{color:"white"}}>
          <Link underline="hover" color="inherit" to="/home" style={{textDecoration:"none",color:"white"}}>
            Home
          </Link>
          <Link underline="hover" color="inherit" 
            to={props.link1}
            style={{textDecoration:"none",color:"white"}}>
            {props.text1}
          </Link>
          <Typography sx={{ color: 'white' }}>{props.text2}...</Typography>
        </Breadcrumbs>
        )
    }else if(Object.keys(props).length===1){
        return (
        <Breadcrumbs aria-label="breadcrumb" style={{color:"white"}}>
          <Link underline="hover" color="inherit" to="/home" style={{textDecoration:"none",color:"white"}}>
            Home
          </Link>
          <Typography sx={{ color: 'white' }}>{props.text1}...</Typography>
        </Breadcrumbs>
        )
    }

  return (
    <Breadcrumbs aria-label="breadcrumb" style={{color:"white"}}>
          <Link underline="hover" color="inherit" to="/home" style={{textDecoration:"none",color:"white",fontWeight:"600"}}>
            Home
          </Link>
          <Link underline="hover" color="inherit" 
            to={props.link1}
            style={{textDecoration:"none",color:"white"}}>
            {props.text1}
          </Link>
          <Link
            underline="hover"
            color="inherit"
            to={props.link2}
            style={{textDecoration:"none",color:"white"}}
          >
            {props.text2}
          </Link>
          <Typography sx={{ color: '#ff5640' }}>{props.text3.slice(0,35)}...</Typography>
        </Breadcrumbs>
  )
}

export default BreadCrumbs