import React, { useEffect, useState } from 'react'
import "../css/SaleProductsPage.css"
import { useNavigate, useParams } from 'react-router-dom'
import axios from 'axios';
import ProductsDisplayComponent from '../components/ProductDisplayComponent/ProductsDisplayComponent';
function SaleProductsPage() {
    let params=useParams();
    let section=params.section;
    let [products,setProducts] =useState(null);
    let [totalProductsNo,setTotalProductsNo]=useState(null);
    let navigate=useNavigate();
    
    async function getProductsContainingBiozyme(){
        try{
            let response=await axios.get(`${process.env.REACT_APP_GET_ALL_PRODUCTS_CONTAINING_KEYWORD}?keyword=biozyme`)
            setProducts(response.data.body.content)
            setTotalProductsNo(response.data.body.totalElements)
        }catch(e){
            console.log(e)
        }
        
    }

    async function getNewArrivalProducts(){
        try{
            let response=await axios.get(`${process.env.REACT_APP_GET_ALL_NEWLY_LAUNCHED_PRODUCTS}`);
            setProducts(response.data.body.content)
            setTotalProductsNo(response.data.body.totalElements)
        }catch(e){

        }
    }

    async function getFewerStockProducts(){
        try{
            let response=await axios.get(`${process.env.REACT_APP_GET_ALL_LOW_STOCK_PRODUCTS}?stockThreshold=10`)
            setProducts(response.data.body.content)
            setTotalProductsNo(response.data.body.totalElements)
        }
        catch(e){
            console.log(e);
        }
    }

    useEffect(()=>{
        if(section==="Biozyme"){
            getProductsContainingBiozyme();
        }
        else if(section==="New Arrivals"){
            getNewArrivalProducts();
        }
        else if(section==="Fewer Stock"){
            getFewerStockProducts();
        }
        else{
            navigate("/error");
        }
        
    },[section,navigate])
  return (
    <div className='sale-products-page-container'>
        <ProductsDisplayComponent products={products} category={section} totalProductsNo={totalProductsNo}/>
    </div>
  )
}

export default SaleProductsPage