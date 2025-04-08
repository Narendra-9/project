import React, { useEffect, useMemo, useRef, useState } from "react";
import Form from "react-bootstrap/Form";
import axios from "axios";
import toast from 'react-hot-toast';
import InputErrorMessage from '../components/InputErrorMessage/InputErrorMessage';
import JoditEditor from 'jodit-react';
import HeadingWithBullet from "../components/HeadingWithBullet/HeadingWithBullet";
import {ReactComponent as PlusIcon} from "../assets/plus.svg"
import showToast from "../components/CustomToast/CustomToast";
import { LABELS } from "../config/labels";
import {ReactComponent as CloseIcon} from "../assets/close.svg"

function AddProduct() {
  // * Categories & Sub-Category Related Stuff.
  const [categories, setCategories] = useState([]);
  const [subCategories, setSubCategories] = useState([]);
  const [categoryId, setCategoryId] = useState();

  // * Image Related fields.
  const [imgFields,setImgFields] = useState([]);
  const [imgURLs,setImgURLs] = useState({});
  const [primaryImg,setPrimaryImg] = useState("");

  // * Errors
  const [errors, setErrors] = useState({});

  // * ProductDto Part
  const [incompleteInput,setIncompleteInput] = useState({
    subCategoryId: "",
    productName:"",
    basePrice:"",
    discountedPrice:"",
    stockQuantity:"",
  });

  // * JoditEditor related states.
  const editor=useRef(null);
  const [content, setContent] = useState("");
  
  // Every single render, it is also rendering making it look like flickering so, I put it in useMemo.
  const config = useMemo(() => ({
    readonly: false,
    toolbarSticky: false,
    style: {
      backgroundColor: "#30404B",
      color: "white",
    },
    placeholder: "Start Typing...",
    theme: "dark", 
  }), []);

  // ! Function to handleInput Change.
  function handleInputChange(e){
    setIncompleteInput({...incompleteInput,[e.target.name]:e.target.value})
  }

  // ! Function to get all available categories.
  async function getCategories() {
    axios
      .get("http://localhost:8080/category")
      .then((response) => setCategories(response.data.body));
  }

  useEffect(() => {
    getCategories();
  }, []);

  // ! Whenever you select a category , corresponding subcategories will be set in subcategory select menu.
  useEffect(() => {
    async function getSubCategories() {
        if (categoryId) {
          axios
            .get(`http://localhost:8080/category/byId/${categoryId}`)
            .then((response) => {
              setSubCategories(response.data);
            });
        }
      }
    getSubCategories();
  }, [categoryId]);

  // ! Function to handle category select change.
  function handleSelectChange(e) {
    setCategoryId(e.target.value);
  }

  // ! Function to validate inputs.
  function validateInputs() {
    // Temp obj to store error.
    let newErrors = {};

    // Category Id Validation
    if (!categoryId){
      newErrors.categoryId = "Category is required.";
    } 

    // Sub-Category Id Validation
    if (!incompleteInput.subCategoryId){
      newErrors.subCategoryId = "Subcategory is required.";
    } 

    // ProductName Validation
    if (!incompleteInput.productName.trim()){
      newErrors.productName = "Product name is required.";
    } 
    else if(incompleteInput.productName.trim().length > 100){
      newErrors.productName = "Product name shouldn't exceed 100 characters.";
    }

    // BasePrice Validation.
    if(!incompleteInput.basePrice){
      newErrors.basePrice = "Base price is required.";
    }
    else if (incompleteInput.basePrice <= 0 || incompleteInput.basePrice > 20000){
      newErrors.basePrice = "Base price must be between 1 and 20,000.";
    }
    
    // DiscountedPrice Validation.
    if(!incompleteInput.discountedPrice){
      newErrors.discountedPrice = "Discounted price is required.";
    }
    else if(Number(incompleteInput.discountedPrice) > Number(incompleteInput.basePrice)){
      newErrors.discountedPrice = "Discounted price cannot be more than base price.";
    }
    if (incompleteInput.discountedPrice<=0){
      newErrors.discountedPrice = "Discounted price should be non-negative";
    }
    
    // StockQuantity Validation
    if(!incompleteInput.stockQuantity){
      newErrors.stockQuantity = "Stock Quantity cannot be empty";
    }
    if (incompleteInput.stockQuantity<=0) {
      newErrors.stockQuantity = "Stock Quantity must be a positive integer.";
    }
    if (incompleteInput.stockQuantity>100000) {
      newErrors.stockQuantity = "Stock quantity shouldn't be more than 100000.";
    }

    // Description Validation
    if(!content){
      newErrors.description = "Description is required."
    }

    // Image field validation
    if (imgFields.length < 2) {
      newErrors.imgFields = "At least 2 image URL is required.";
    }
    Object.values(imgURLs).forEach((url, index) => {
      if (!/^https?:\/\/.+\.(jpeg|jpg|gif|png)$/.test(url)) {
        newErrors[`img_${index}`] = "Invalid image URL.";
      }
    });

    // Primary Image Validation.
    if (!primaryImg) {
      newErrors.primaryImg = "Please select a primary image.";
    }

    // Setting the available errors in the state.
    setErrors(newErrors);

    // Returning true if there are no errors else false.
    return Object.keys(newErrors).length === 0;
  }
 
  // ! Function to save Product.
  function saveProduct() {

    // Validating the product before adding.
    if (!validateInputs()) {
      showToast(LABELS.invalidForm,"error")
      return;
    }

    let productDto = incompleteInput;
    let listOfImageURLs = Object.values(imgURLs); 

    productDto.productName=incompleteInput.productName.trim();
    productDto.description = content;
    productDto.primaryImg = primaryImg;
    productDto.listOfImageURLs = listOfImageURLs;

    try{
      axios.post("http://localhost:8080/products", JSON.stringify(productDto), {
        headers: {
          'Accept': "application/json",
          "Content-Type": "application/json"
        }
        }).then(() => {

        showToast(LABELS.productAdded,"success")

        setIncompleteInput({
          subCategoryId: "",
          productName: "",
          basePrice: "",
          discountedPrice: "",
          stockQuantity: "",
        });

        setCategoryId("");
        setSubCategories([]); 
        setImgFields([]); 
        setImgURLs({}); 
        setPrimaryImg(""); 
        setContent("");
        setErrors({});
      }).catch((error) => {
        toast.error("Failed to add product.");
      });
    }catch(e){
      console.log(e)
    }
  }

  // ! Function to add Image Field.
  function addImageField(){
    const newImgField = `image_${imgFields.length + 1}`;
    setImgFields([...imgFields, newImgField]);
  }

  //  ! Function to delete Image Fields.
  function deleteImgField(index) {

    // Filtering out the unwanted Img,
    const filteredFields = imgFields.filter((_, i) => i !== index);
    setImgFields(filteredFields);
  
    // Also removing the corresponding image URL
    const newImgURLs = { ...imgURLs };
    delete newImgURLs[imgFields[index]];
    setImgURLs(newImgURLs);
  }

  // ! Function to handle ImgURLInput.
  function handleImgURLInput(e){
    setImgURLs({...imgURLs,[e.target.name]:e.target.value})
  }

  // ! Function to handle PrimaryImg Select.
  function handlePrimaryImgSelectChange(e){
    setPrimaryImg(e.target.value)
  }
  
  return (
    <div className="add-product-container">
      <HeadingWithBullet heading={"Drop a New Product"}/>
      <div className="row mt-3">
        <div className="col-lg-4 mb-3">

            <label>Category <span style={{color:"#FF5640"}}>*</span></label>
            <Form.Select
              aria-label="Floating label select example"
              onChange={handleSelectChange}
              className="manage-product-input-field"
            >
              <option value="" className="category-select-option">--</option>
              {categories.map((c) => (
                <option key={c.categoryId} value={c.categoryId} className="category-select-option">
                  {c.categoryName}
                </option>
              ))}
            </Form.Select>
            {errors.categoryId && <InputErrorMessage errorMessage={errors.categoryId}/>}
            
            

        </div>
        <div className="col-lg-4 mb-3">
            
            <label>Sub-Category <span style={{color:"#FF5640"}}>*</span></label>
            <Form.Select
              aria-label="Floating label select example"
              name="subCategoryId"
              onChange={handleInputChange}
              className="manage-product-input-field"
            >
              <option value="" className="category-select-option">--</option>
              {subCategories.map((sc) => (
                <option key={sc.subCategoryId} value={sc.subCategoryId} className="category-select-option">
                  {sc.subCategoryName}
                </option>
              ))}
            </Form.Select>
            {errors.subCategoryId && <InputErrorMessage errorMessage={errors.subCategoryId}/>}

        </div>

        <div className="col-lg-4 mb-2">
            
            <label>Stock Quantity <span style={{color:"#FF5640"}}>*</span></label>
            <Form.Control
              type="number"
              name="stockQuantity"
              min={1}
              max={100000}
              value={incompleteInput.stockQuantity}
              placeholder="Enter Product Quantity"
              onChange={handleInputChange}
              className="manage-product-input-field number-input"
              onKeyDown={(e) => {
                if (["e", "E", "+", "-"].includes(e.key)) e.preventDefault();
              }}
            />
            {errors.stockQuantity && <InputErrorMessage errorMessage={errors.stockQuantity}/>}

        </div>
      </div>
      <div className="row">
        <div className="col-lg-4 mb-2">

            <label>Product Name <span style={{color:"#FF5640"}}>*</span></label>
            <Form.Control
              type="text"
              name="productName"
              value={incompleteInput.productName}
              onChange={handleInputChange}
              placeholder="Enter Product Name"
              maxLength={100}
              className="manage-product-input-field number-input"
            />
            {errors.productName && <InputErrorMessage errorMessage={errors.productName}/>}

        </div>
        <div className="col-lg-4 mb-2">

            <label>Base Price <span style={{color:"#FF5640"}}>*</span></label>
            <Form.Control
              type="number"
              name="basePrice"
              value={incompleteInput.basePrice}
              min={1}
              max={20000}
              onChange={handleInputChange}
              placeholder="Enter Base Price"
              className="manage-product-input-field number-input"
              onKeyDown={(e) => {
                if (["e", "E", "+", "-"].includes(e.key)) e.preventDefault();
              }}
            />
            {errors.basePrice && <InputErrorMessage errorMessage={errors.basePrice}/>}

        </div>
        <div className="col-lg-4 mb-2">

            <label>Discounted Price <span style={{color:"#FF5640"}}>*</span></label>
            <Form.Control
              type="number"
              name="discountedPrice"
              min={1}
              max={20000}
              value={incompleteInput.discountedPrice}
              onChange={handleInputChange}
              placeholder="Enter Discounted Price"
              className="manage-product-input-field number-input"
              onKeyDown={(e) => {
                if (["e", "E", "+", "-"].includes(e.key)) e.preventDefault();
              }}
            />
            {errors.discountedPrice && <InputErrorMessage errorMessage={errors.discountedPrice}/>}  

        </div>
      </div>

      <div className="row mt-3 description-editor-container">
        <label>Description <span style={{color:"#FF5640"}}>*</span></label>
        <div className="jodit-editor-container">
          <JoditEditor
          ref={editor}
          value={content}
          tabIndex={1}
          config={config}
          onBlur={newContent => setContent(newContent)}
          />
          {errors.description && <InputErrorMessage errorMessage={errors.description}/>}  
        </div>
      </div>

      <div className="row mt-3">
        <div className="description-heading">
        <label>Images <span style={{color:"#FF5640"}}>*</span></label>
        <button onClick={addImageField} className="add-product-plus-btn ms-2"><PlusIcon className="add-product-plus-icon"/></button>
        </div>
      </div>

      <div className="row mt-3">
        {imgFields.map((field, index) => (
          <div className="col-lg-6 mb-4 add-product-img-field-outermost" key={index}>
            <CloseIcon className="add-product-img-field-close" onClick={()=>deleteImgField(index)}/>
            <div className="text-center mb-2"><img src={imgURLs[field]} alt="display-image" className="product-display-image"></img></div>
            <label>Image {index+1} {index<2 && <span style={{color:"#FF5640"}}>*</span>}</label>
                <Form.Control
                  type="text"
                  name={field}
                  placeholder={`Image Field ${index + 1} (Paste the URL)`}
                  onChange={handleImgURLInput}
                  value={imgURLs[index]}
                  className="manage-product-input-field"
                />
            {errors[`img_${index}`] && <InputErrorMessage errorMessage={errors[`img_${index}`]}/>}
          </div>
        ))}
      </div>

      <div className="row">
        <div className="col-lg-4">
            <label>Primary Image <span style={{color:"#FF5640"}}>*</span></label>
            <Form.Select
              aria-label="Floating label select example"
              onChange={handlePrimaryImgSelectChange}
              className="manage-product-input-field"
            >
              <option value="" className="category-select-option">--</option>
              {imgFields.map((imgField,index) => (
                <option value={imgURLs[imgField]} key={index} className="category-select-option">
                  {imgField}
                </option>
              ))}
            </Form.Select>

        </div>
      </div>

      <div className="row justify-content-end">
        <div className="col-lg-2">
          <button className="add-product-btn" onClick={saveProduct}>
            Save
          </button>
        </div>
      </div>
      
    </div>
  );
}

export default AddProduct;
