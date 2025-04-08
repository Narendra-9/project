import React, { useEffect, useState } from 'react';
import Form from 'react-bootstrap/Form';
import axios from 'axios';
import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import Typography from '@mui/material/Typography';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import DeleteIcon from '@mui/icons-material/Delete';
import InputErrorMessage from '../components/InputErrorMessage/InputErrorMessage';
import toast from 'react-hot-toast';

function AddCategoryPage() {
    const [categories, setCategories] = useState([]);
    const [categoryInput, setCategoryInput] = useState({ categoryName: "" ,categoryImgUrl:"",categoryDisplayImgUrl:"",categoryDescription:""});
    const [subCategoryInput, setSubCategoryInput] = useState({ categoryId: "", subCategoryName: "",subCategoryDescription:"" });
    const [errors,setErrors]=useState({});

    const categoryNameRegex = /^(?!\s)(?!.*\s{2})[A-Za-z0-9\s]{3,30}(?<!\s)$/;
    const validImageUrlRegex = /^(https?:\/\/)?([a-z0-9]+[\-\.])*(?:[a-z0-9]+)(?:\/[^\s]*)*\.(?:jpg|jpeg|png|gif|bmp|svg)$/i;
    const subCategoryNameRegex = /^(?!\s)(?!.*\s{2})[A-Za-z0-9\s]{3,30}(?<!\s)$/;

    const isValidCategoryName=(name)=>{
      return categoryNameRegex.test(name);
    }

    const isValidSubCategoryName=(name)=>{
      return subCategoryNameRegex.test(name);
    }

    const isValidImageUrl = (url) => {
      return validImageUrlRegex.test(url);
    };

    const validateCategoryInput = () => {
      const newErrors = {};

      if(!isValidCategoryName(categoryInput.categoryName)){
        newErrors.categoryName="Invalid Category Name"
      }

      if (categoryInput.categoryImgUrl && !isValidImageUrl(categoryInput.categoryImgUrl)) {
          newErrors.categoryImgUrl = "Invalid Home Page Display Image URL!";
      }

      if (!isValidImageUrl(categoryInput.categoryDisplayImgUrl)) {
          newErrors.categoryDisplayImgUrl = "Invalid Category Page Display Image URL!";
      }

      if (!categoryInput.categoryDescription) {
          newErrors.categoryDescription = "Category description is required!";
      }else if(categoryInput.categoryDescription.length>1000){
          newErrors.categoryDescription = "Category description should not exceed 1000 characters!";
      }

      setErrors(newErrors);
      return Object.keys(newErrors).length === 0;
    };

    const validateSubCategoryInput = () => {
      const newErrors = {};

      if (!subCategoryInput.categoryId ) {
          newErrors.categoryId = "Please select a category for the sub-category!";
      }

      if (!isValidSubCategoryName(subCategoryInput.subCategoryName)) {
          newErrors.subCategoryName = "Invalid Sub Category Name";
      }

      if (!subCategoryInput.subCategoryDescription) {
        newErrors.categoryDescription = "Sub-category description is required!";
      }else if(subCategoryInput.subCategoryDescription.length>1000){
          newErrors.subCategoryDescription = "Category description should not exceed 1000 characters!";
      }

      setErrors(newErrors);
      return Object.keys(newErrors).length === 0;
    };
  

    async function handleSubCategoryAdd() {
        if (!validateSubCategoryInput()) return;  
        await axios.post("http://localhost:8080/sub-category", JSON.stringify(subCategoryInput), {
          headers: {
              'Accept': "application/json",
              "Content-Type": "application/json"
          }
      });
      getCategories();
      toast.success("Sub-Category Added Successfully !");
      setSubCategoryInput({ categoryId: "", subCategoryName: "",subCategoryDescription:"" })
    }

    async function getCategories() {
        axios.get("http://localhost:8080/category")
        .then(response => setCategories(response.data.body));
    }

    useEffect(() => {
        getCategories();
    }, []);

    function handleCategoryInputChange(e) {
        setCategoryInput({ ...categoryInput, [e.target.name]:e.target.value});
    }

    function handleSubCategoryInputChange(e) {
        setSubCategoryInput({ ...subCategoryInput, [e.target.name]:e.target.value });
    }

    async function handleCategoryAdd() {
      if (!validateCategoryInput()) return;
      console.log(categoryInput)
      try{
        await axios.post("http://localhost:8080/category", JSON.stringify(categoryInput), {
          headers: {
              'Accept': "application/json",
              "Content-Type": "application/json"
          }
      });
      getCategories();
      toast.success("Category Added Successfully!")
      setCategoryInput({categoryName: "" ,categoryImgUrl:"",categoryDisplayImgUrl:"",categoryDescription:""})
      }catch (error) {
        toast.error(error.response.data.categoryName);
        console.log(error)
    }
        
    }

    function deleteCategory(categoryId) {
      const isConfirmed = window.confirm("Are you sure you want to delete this category?");
      if (isConfirmed) {
        try{
          axios.delete(`http://localhost:8080/category/deleteById/${categoryId}`)
          .then(() => getCategories()).catch((err) => {
            if (err.response) {
              if (err.response.status === 500) {
                // toast.error();

                toast.error("Sorry due to some reasons delete is blocked right now !, It will be right back", {
                  position: "bottom-center",
                  style: {
                    border: "1px solid white",
                    // color: "white",
                    // backgroundColor: "#FF5640",
                  },
                  iconTheme: {
                    primary: "#FF5640",
                    secondary: "white",
                  },
                });
              } else {
                toast.error(`Error: ${err.response.data.message || 'An error occurred!'}`);
              }
            }
          });
          // toast.success("Category Deleted Successfully!");         
        }
        catch(err){
          console.log(err)
        }

        
      }
    }

    function deleteSubCategory(subCategoryId) {
      const isConfirmed = window.confirm("Are you sure you want to delete this sub-category?");
      if (isConfirmed) {
        axios.delete(`http://localhost:8080/sub-category/deleteById/${subCategoryId}`)
          .then(() => getCategories());
        toast.success("Sub-Category Deleted Successfully!");
      }
    }

    return (
        <div className="container" style={{marginTop:"100px"}}>
            <h2 className="mt-4" style={{color:"#ff5640"}}>Add Category</h2>
            <div className="row mt-4">
                <div className="col-lg-4 mb-3">

                        <Form.Control type="text" placeholder="Category Name" name='categoryName' value={categoryInput.categoryName} onChange={handleCategoryInputChange} className='category-page-input'/>
                        {errors.categoryName && <InputErrorMessage errorMessage={errors.categoryName}/>}
                        
                </div>
                <div className="col-lg-4 mb-3">

                        <Form.Control type="text" placeholder="Home Page Display Image" name='categoryImgUrl' value={categoryInput.categoryImgUrl} onChange={handleCategoryInputChange} className='category-page-input'/>
                        {errors.categoryImgUrl && <InputErrorMessage errorMessage={errors.categoryImgUrl}/>}


                </div>

                <div className="col-lg-4 mb-3">

                        <Form.Control type="text" placeholder="Category Page Display Image" name='categoryDisplayImgUrl' value={categoryInput.categoryDisplayImgUrl} onChange={handleCategoryInputChange} className='category-page-input'/>
                        {errors.categoryDisplayImgUrl && <InputErrorMessage errorMessage={errors.categoryDisplayImgUrl}/>}

                </div>

                <div className='col-lg-12 mb-3'>
                <Form.Control
                  name="categoryDescription"
                  as="textarea"
                  placeholder="Category Description"
                  style={{ height: "100px" }}
                  value={categoryInput.categoryDescription}
                  onChange={handleCategoryInputChange}
                  className="manage-product-input-field"
                  />
                  {errors.categoryDescription && <InputErrorMessage errorMessage={errors.categoryDescription}/>}

                </div>

                <div className="col-lg-12 d-flex justify-content-end mb-3">
                    <button className="category-add-btn" onClick={handleCategoryAdd}>Add</button>
                </div>
            </div>

            <h2 className="mt-4 mb-3" style={{color:"#ff5640"}}>Add Sub-Category</h2>
            <div className="row">
                <div className="col-lg-6 mb-3">

                        <Form.Select aria-label="Floating label select example" onChange={handleSubCategoryInputChange} name='categoryId' className='category-page-input'>
                            <option className='category-select-option'>Select Category From the menu</option>
                            {categories.map(c => (
                                <option className='category-select-option' key={c.categoryId} value={c.categoryId}>{c.categoryName}</option>
                            ))}
                        </Form.Select>
                        {errors.categoryId && <InputErrorMessage errorMessage={errors.categoryId}/>}


                </div>
                <div className="col-lg-6 mb-3">

                        <Form.Control type="text" name='subCategoryName' placeholder="Sub-Category Name" value={subCategoryInput.subCategoryName} onChange={handleSubCategoryInputChange} className='category-page-input'/>
                        {errors.subCategoryName && <InputErrorMessage errorMessage={errors.subCategoryName}/>}

                </div>

                <div className='col-lg-12 mb-3'>
                <Form.Control
                  name="subCategoryDescription"
                  as="textarea"
                  placeholder="Sub-Category Description"
                  style={{ height: "100px" }}
                  value={subCategoryInput.subCategoryDescription}
                  onChange={handleSubCategoryInputChange}
                  className="manage-product-input-field"
                  />
                  {errors.subCategoryDescription && <InputErrorMessage errorMessage={errors.subCategoryDescription}/>}


                </div>

                <div className="col-lg-12 d-flex justify-content-end">
                    <button className="category-add-btn" onClick={handleSubCategoryAdd}>Add</button>
                </div>
            </div>

            <h2 className='mt-5'style={{color:"#ff5640"}}>Catgeories & Sub-Categories</h2>
            <div className='row'>
              <div className='col-lg-6'>
                  {categories.map(category => {return (
                    <Accordion className='category-accordian'>
                      <AccordionSummary
                        expandIcon={<ArrowDropDownIcon />}
                        aria-controls="panel2-content"
                        id="panel2-header">
                      <div style={{display:"flex",justifyContent:"space-between",width:"100%",alignItems:"center"}}><div className='accordian-text-content'>{category.categoryName}</div><DeleteIcon className='me-4 ' onClick={()=>deleteCategory(category.categoryId)}/></div>
                      </AccordionSummary>
                      <AccordionDetails>
                        <Typography>
                          {category.listOfSubCategoryResponseDtos.map((subCategory) => {
                            return (
                              <div style={{display:"flex",justifyContent:"space-between",width:"100%",alignItems:"baseline",marginBottom:"15px"}}><div className='accordian-summary-content'>{subCategory.subCategoryName}</div> <DeleteIcon className='me-5' onClick={()=>deleteSubCategory(subCategory.subCategoryId)}>Delete</DeleteIcon></div>
                            )
                          })}
                        </Typography>
                      </AccordionDetails>
                    </Accordion>
                  )})}
              </div>
            </div>
            {/* <ToastContainer/> */}
        </div>
    );
}

export default AddCategoryPage;
