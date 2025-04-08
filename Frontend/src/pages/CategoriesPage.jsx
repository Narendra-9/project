import React, { useEffect, useState } from "react";
import "../css/CategoriesPage.css";
import BreadCrumbs from "../components/BreadCrumbs/BreadCrumbs";
import { Divider } from "@mui/material";
import axios from "axios"
import { useNavigate } from "react-router-dom";
function CategoriesPage() {

    let [categories, setCategories] = useState(null);
    let navigate=useNavigate();
    async function getAllCategories(){
        let response= await axios.get(process.env.REACT_APP_GET_ALL_CATEGORIES_WITH_SUBCATEGORIES);
        setCategories(response.data.body);
    }

    useEffect(() => {
        getAllCategories();
    },[])

   

  return (
    <div className="user-categories-page">

      <div className="row mb-2">
        <div className="col">
          <BreadCrumbs text1={"Categories"} />
        </div>
      </div>

      <Divider style={{ color: "white", backgroundColor: "white" }} />

      <div className="categories-page-categories-container mt-5">
        
        <div className="categories-heading">
            <div className="bullet-point mb-2 me-2"></div>
            <h1>Categories</h1>
        </div>

        <div className="categories-page-category-cards">
            {categories?.map(category => {
                return (
                    <div className="category-page-category-card" onClick={()=>navigate(`${category.categoryName}`)}>
                        <img src={category.categoryDisplayImgUrl} alt="category-img" ></img>
                    </div>
                )
            })}
        </div>
      </div>
    </div>
  );
}

export default CategoriesPage;
