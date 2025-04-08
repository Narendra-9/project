import Modal from 'react-bootstrap/Modal';
import styles from "./AddReviewModal.module.css"
import Rating from '@mui/material/Rating';
import { useContext, useEffect, useState } from 'react';
import StarIcon from '@mui/icons-material/Star';
import {ReactComponent as CloseIcon} from "../../assets/close.svg"
import axios from 'axios';
import showToast from '../CustomToast/CustomToast';
import { LABELS } from '../../config/labels';
import InputErrorMessage from '../InputErrorMessage/InputErrorMessage';
import { UserConext } from '../../context/UserContext';

function AddReviewModal({show,handleClose,product,primaryImgUrl,getProduct,reviewToEdit,setReviewToEdit}) {

    const [reviewDto,setReviewDto]=useState({
        rating:0,
        comment:"",
        title:""
    });
    const [errors,setErrors]=useState({});
    const {user}=useContext(UserConext);
    let productNameSplitArray=product?.productName?.split(",");
    let sanitizedProductName
    let productWeight;
    let productFlavour;
    if(productNameSplitArray){
        sanitizedProductName=productNameSplitArray[0];
        productWeight=productNameSplitArray[1];
        if(productNameSplitArray[2]){
            productFlavour=productNameSplitArray[2];
        }
    }

    useEffect(() => {
        if (reviewToEdit) {
            setReviewDto({
                rating:reviewToEdit.rating,
                comment:reviewToEdit.comment,
                title:reviewToEdit.title
            })
        }else{
            setReviewDto({
                rating:0,
                comment:"",
                title:""
            })
        }
      }, [reviewToEdit]);

    const handleModalClose=()=>{
        setErrors({});
        setReviewDto({
            rating:0,
            comment:"",
            title:""
        });
        if(reviewToEdit){
            setReviewToEdit(null)
        }
        handleClose();
    }
    
    const handleInputChange=(e)=>{
        const {name,value}=e.target;

        setReviewDto({...reviewDto,[name]:value});
    }

    const validateInputs=()=>{
        let newErrors={}

        if(!reviewDto.rating){
            newErrors.rating=LABELS.ratingRequired;
        }

        if(!reviewDto.title.trim()){
            newErrors.title=LABELS.reviewTitleRequired;
        }
        else if(reviewDto.title.trim().length>100){
            newErrors.title=LABELS.reviewTitleLimitReached;
        }

        if(!reviewDto.comment){
            newErrors.comment=LABELS.reviewCommentRequired;
        }
        else if(reviewDto.comment.trim().length>500){
            newErrors.comment=LABELS.reviewCommentLimitReached
        }
        
        setErrors(newErrors);
        return Object.keys(newErrors).length ===0;
    }

    const publishReview=async ()=>{

        if(!validateInputs()){
            showToast("Form's not happy, check fields","error");
            return;
        }

        try {
            reviewDto.title=reviewDto.title.trim();
            reviewDto.comment=reviewDto.comment.trim();
            reviewDto.userId=user?.userId;
            reviewDto.productId=product?.productId;

            await axios.post(process.env.REACT_APP_REVIEW_SERVICE_API, reviewDto, {
                headers: {
                  'Accept': "application/json",
                  "Content-Type": "application/json"
                }
            });

            setReviewDto({
                rating:0,
                comment:"",
                title:""
            });
            getProduct();
            handleClose();
            showToast(LABELS.reviewAdded,"success");
        }catch(err){
            if(err.status===406){
                showToast(LABELS.notOrdered,"error")
            }
            else{
                showToast(LABELS.defaultErrorMessage,"error")
            }
            console.log(err);
        }
    }
    

  return (
      <Modal show={show} onHide={handleModalClose}>
        <Modal.Body className={styles.modalBody}>
            <CloseIcon className={styles.closeIcon} onClick={handleModalClose}/>
            <div className={styles.modalTitle}>
                <div className={styles.productImg}>
                    {primaryImgUrl ? (
                        <img src={primaryImgUrl} style={{borderRadius:"10px"}} alt='product-Img' height="100px" width="100px"></img>
                    ):(
                        <img src={product?.primaryImageUrl} style={{borderRadius:"10px"}} alt='product-Img' height="100px" width="100px"></img>
                    )}
                </div>

                <div className={styles.titleContent}>
                    <p className={styles.productName}>{sanitizedProductName}</p>
                    <p className={styles.variant}><span>{productWeight}</span> &#183; <span>{productFlavour}</span></p>
                </div>
            </div>

            <div className={styles.modalBody}>
                <p className='mt-5' style={{fontWeight:"bold"}}>Share Your Experience</p>

                <div className={styles.ratingDiv}>
                    <p>Rate this product <span style={{color:"red"}}>*</span></p>
                    <Rating
                        className={styles.rating}
                        name="simple-controlled"
                        value={reviewDto.rating}
                        size='large'
                        icon={<StarIcon sx={{ color: '#FFD700', stroke: 'gold', strokeWidth: 1 ,margin:"0px 4px"}} />} 
                        emptyIcon={<StarIcon sx={{ color: 'transparent', stroke: 'white', strokeWidth: 1 ,margin:"0px 4px"}} />}
                        onChange={(event, newValue) => {
                        setReviewDto({...reviewDto,"rating":newValue})
                        }}
                    />
                    {errors.rating && <InputErrorMessage errorMessage={errors.rating}/>}

                    
                </div>

                <div className={styles.tileInputDiv}>
                    <label className='mb-2'>Title <span style={{color:"red"}}>*</span></label>
                    <input type='text' className={styles.input} value={reviewDto.title} name='title' onChange={handleInputChange} id='title' placeholder='Please enter a suitable Title here'></input>
                    {errors.title && <InputErrorMessage errorMessage={errors.title}/>}
                </div>

                <div className={styles.descriptionInputDiv}>
                    <label className='mb-2'>Description <span style={{color:"red"}}>*</span></label>
                    <textarea className={styles.input} id='comment' value={reviewDto.comment} name='comment' onChange={handleInputChange} placeholder='Write your review here'></textarea>
                    {errors.comment && <InputErrorMessage errorMessage={errors.comment}/>}
                </div>

            </div>
        </Modal.Body>
        <Modal.Footer  className={styles.modalFooter}>
          <button className={styles.saveBtn}  onClick={publishReview}>
            Publish Review
          </button>
        </Modal.Footer>
      </Modal>
  );
}

export default AddReviewModal;