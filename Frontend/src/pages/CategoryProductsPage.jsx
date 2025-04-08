import React from 'react'
import "../css/CategoryProductsPage.css"
import { useParams } from 'react-router-dom'
import ProductsDisplayComponent2 from '../components/ProductDisplayComponent/ProductDisplayComponent2';

function CategoryProductsPage() {
    let params=useParams();
    let categoryNameStr=params.category
  return (
    <div className='category-products-page-container'>
        <ProductsDisplayComponent2 categoryNameStr={categoryNameStr}/>
    </div>
  )
}

export default CategoryProductsPage