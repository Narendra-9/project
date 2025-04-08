import React from 'react'
import "./SearchResult.css"
import { Link } from 'react-router-dom'
function SearchResult(props) {

  return (
    <div className='searched-products-container'>
    {props.notFound&&<div className='not-found-content'>
        <div className='not-found-img'>
            <img src="/not_found_gif.gif" alt='not-found-img' height="350px"></img>
        </div>
    </div>}
    {props.products.map((product, index) => {
      return (
        <div className='suggested-item-container'>
        <Link to={`/products/${product?.slug}`} style={{textDecoration:"none"}}>
          <div className='suggested-item'>
            {/* <img className='item-img' src={product.listOfImages[0].url} alt='product-img' height="90px"></img> */}
            <img className='item-img' src={product?.primaryImageUrl} alt='product-img' height="90px"></img>
            <p className='item-name'>{product?.productName}</p>
          </div>
        </Link>
        <hr style={{color:"white",margin:"0"}}></hr>
        </div>
        
      )
    })}
  </div>
  )
}

export default SearchResult