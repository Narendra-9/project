import React, { useState } from 'react'
import DescriptionIcon from '@mui/icons-material/Subject';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import "./ProductDescription.css"


function ProductDescription({productDescription}) {
    let [openProductDescription,setOpenProductDescription] = useState(false)

    function expandDescription(){
        setOpenProductDescription(prev=>!prev);
      }

  return (
    <div className='product-description-container mt-3' style={{color:"white"}}>
    <div className='product-description-heading d-flex'>
        <DescriptionIcon style={{color:"#ff5640"}}/> <p className='m-0'>About the Product</p>
    </div>
    <div className='product-description-body' style={{height:openProductDescription?"auto":"100px"}}>
      <div dangerouslySetInnerHTML={{ __html: productDescription }} />
    </div>
    <div className='read-more-container mt-2'>
        <p onClick={expandDescription} className='text-center read-more'>
            {openProductDescription ? <><span>Read Less</span><KeyboardArrowUpIcon/></>:<><span>Read More</span><KeyboardArrowDownIcon/></>}
        </p>
    </div>
</div>
  )
}

export default ProductDescription