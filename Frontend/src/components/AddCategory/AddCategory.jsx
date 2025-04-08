import React, { useState } from "react";
import Form from "react-bootstrap/Form";
import InputErrorMessage from "../../components/InputErrorMessage/InputErrorMessage";
import toast from "react-hot-toast";
import axios from "axios";


const categoryNameRegex = /^(?!\s)(?!.*\s{2})[A-Za-z0-9\s]{3,30}(?<!\s)$/;
const validImageUrlRegex = /^(https?:\/\/)?([a-z0-9]+[\-\.])*(?:[a-z0-9]+)(?:\/[^\s]*)*\.(?:jpg|jpeg|png|gif|bmp|svg)$/i;

function AddCategory({setCategories}) {
  const [categoryInput, setCategoryInput] = useState({
    categoryName: "",
    categoryImgUrl: "",
    categoryDisplayImgUrl: "",
    categoryDescription: "",
  });
  const [errors, setErrors] = useState({});

  const isValidCategoryName=(name)=>{
    return categoryNameRegex.test(name);
  }

  const isValidImageUrl = (url) => {
    return validImageUrlRegex.test(url);
  };

  function handleCategoryInputChange(e) {
    setCategoryInput({ ...categoryInput, [e.target.name]: e.target.value });
  }

  const validateCategoryInput = () => {
    const newErrors = {};

    if (!isValidCategoryName(categoryInput.categoryName)) {
      newErrors.categoryName = "Invalid Category Name";
    }

    if (!isValidImageUrl(categoryInput.categoryImgUrl)) {
      newErrors.categoryImgUrl = "Invalid Home Page Display Image URL!";
    }

    if (!isValidImageUrl(categoryInput.categoryDisplayImgUrl)) {
      newErrors.categoryDisplayImgUrl =
        "Invalid Category Page Display Image URL!";
    }

    if (!categoryInput.categoryDescription) {
      newErrors.categoryDescription = "Category description is required!";
    } else if (categoryInput.categoryDescription.length > 1000) {
      newErrors.categoryDescription =
        "Category description should not exceed 1000 characters!";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  async function handleCategoryAdd() {
    if (!validateCategoryInput()) return;
    console.log(categoryInput);
    try {
    let response=await axios.post(
        "http://localhost:8080/category",
        JSON.stringify(categoryInput),
        {
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
          },
        }
      );

      setCategories((prev)=>[...prev,response.data.body]);

      toast.success("Category Added Successfully!");
      setCategoryInput({
        categoryName: "",
        categoryImgUrl: "",
        categoryDisplayImgUrl: "",
        categoryDescription: "",
      });
    } catch (error) {
      toast.error(error.response.data.categoryName);
      console.log(error);
    }
  }

  return (
    <div className="row mt-4">
      <div className="col-lg-4 mb-3">
        <Form.Control
          type="text"
          placeholder="Category Name"
          name="categoryName"
          value={categoryInput.categoryName}
          onChange={handleCategoryInputChange}
          className="category-page-input"
        />
        {errors.categoryName && (
          <InputErrorMessage errorMessage={errors.categoryName} />
        )}
      </div>
      <div className="col-lg-4 mb-3">
        <Form.Control
          type="text"
          placeholder="Home Page Display Image"
          name="categoryImgUrl"
          value={categoryInput.categoryImgUrl}
          onChange={handleCategoryInputChange}
          className="category-page-input"
        />
        {errors.categoryImgUrl && (
          <InputErrorMessage errorMessage={errors.categoryImgUrl} />
        )}
      </div>
      <div className="col-lg-4 mb-3">
        <Form.Control
          type="text"
          placeholder="Category Page Display Image"
          name="categoryDisplayImgUrl"
          value={categoryInput.categoryDisplayImgUrl}
          onChange={handleCategoryInputChange}
          className="category-page-input"
        />
        {errors.categoryDisplayImgUrl && (
          <InputErrorMessage errorMessage={errors.categoryDisplayImgUrl} />
        )}
      </div>

      <div className="col-lg-12 mb-3">
        <Form.Control
          name="categoryDescription"
          as="textarea"
          placeholder="Category Description"
          style={{ height: "100px" }}
          value={categoryInput.categoryDescription}
          onChange={handleCategoryInputChange}
          className="manage-product-input-field"
        />
        {errors.categoryDescription && (
          <InputErrorMessage errorMessage={errors.categoryDescription} />
        )}
      </div>

      <div className="col-lg-12 d-flex justify-content-end mb-3">
        <button className="category-add-btn" onClick={handleCategoryAdd}>
          Add
        </button>
      </div>
    </div>
  );
}

export default AddCategory;
