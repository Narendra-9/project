import React, { useContext, useEffect, useState } from "react";
import styles from "./ProductReviews.module.css";
import Rating from "@mui/material/Rating";
import Avatar from "@mui/material/Avatar";
import StarIcon from '@mui/icons-material/Star';  
import {ReactComponent as SuccessIcon} from "../../assets/success.svg"
import LinearProgress from '@mui/material/LinearProgress';
import { UserConext } from "../../context/UserContext";
import AddReviewModal from "../AddReviewModal/AddReviewModal";
import {ReactComponent as EditIcon} from "../../assets/edit.svg"
import { Tooltip } from "@mui/material";
import { ThemeContext } from "../../context/ThemeContext";

function ProductReviews({ product ,getProduct}) {

  const {user,openPopUp}=useContext(UserConext);
  const {isPremium}=useContext(ThemeContext)
  const [myReview,setMyReview]=useState(null);

  // * AddReviewModal Related
  const [show, setShow] = useState(false);
  const [toBeReviewProduct,setToBeReviewProduct] = useState(null);
  const [reviewToEdit,setReviewToEdit]=useState(null);
  const handleClose = () => setShow(false);
  const handleShow = (product,review) => {
    if(!user){
      openPopUp();
      return;
    }
    setToBeReviewProduct(product)
    setReviewToEdit(review)
    setShow(true)
  }

  // ! Caluclating percentage for each star.
  const listofAllreviews = product?.listOfReviews;

  const totalReviews = listofAllreviews?.length;

  const fiveStarCount = listofAllreviews.filter(review => review.rating === 5).length;
  const fourStarCount = listofAllreviews.filter(review => review.rating === 4).length;
  const threeStarCount = listofAllreviews.filter(review => review.rating === 3).length;
  const twoStarCount = listofAllreviews.filter(review => review.rating === 2).length;
  const oneStarCount = listofAllreviews.filter(review => review.rating === 1).length;

  const fiveStarPercentage = totalReviews ? (fiveStarCount / totalReviews) * 100 : 0;
  const fourStarPercentage = totalReviews ? (fourStarCount / totalReviews) * 100 : 0;
  const threeStarPercentage = totalReviews ? (threeStarCount / totalReviews) * 100 : 0;
  const twoStarPercentage = totalReviews ? (twoStarCount / totalReviews) * 100 : 0;
  const oneStarPercentage = totalReviews ? (oneStarCount / totalReviews) * 100 : 0;

  useEffect(() => {
    if(user){
      const myTempReview=product?.listOfReviews?.filter(review=>review?.user?.userId===user?.userId)[0];
      if(myTempReview){
        setMyReview(myTempReview)
      }
    }
  },[user,product])

  function formatDate(date) {
    const formattedDate = new Date(date).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
    return formattedDate;
  }

  if(product?.listOfReviews?.length===0){
    return (
      <div className={isPremium ? styles.noReviewsDivPremium:styles.noReviewsDiv}>
        <AddReviewModal show={show} getProduct={getProduct} reviewToEdit={reviewToEdit} setReviewToEdit={setReviewToEdit}  handleClose={handleClose} product={toBeReviewProduct} primaryImgUrl={product?.listOfImages[0].url}/>
        <h2 className="mb-4">{product?.productName} Reviews</h2>
        <div className={styles.noReviewsMessage}>
          <p style={{fontSize:"20px"}}>No reviews yet</p>
          <p>You’re the first to hit the review stage 🔥! Flex those words and let everyone know how these supplements are fueling your workout!</p>
          <button className={styles.writeReview} onClick={()=>handleShow(product,null)}>Write a Review</button>
        </div>

      </div>
    )
  }

  return (
    <div className={styles.reviewsContainer}>
      
      <AddReviewModal show={show} getProduct={getProduct} reviewToEdit={reviewToEdit} setReviewToEdit={setReviewToEdit}  handleClose={handleClose} product={toBeReviewProduct} primaryImgUrl={product?.listOfImages[0].url}/>

      <h2 className="mb-4">{product?.productName} Reviews</h2>

      <div className={styles.flex1}>
      
        <div className={isPremium? styles.customerReviewsPremium : styles.customerReviews}>
          <p className="mb-3" style={{fontWeight:"bold"}}>Customer Reviews</p>

          <div className={styles.overAllRating}>
            <p>{product?.avgRating}</p>
            <Rating
              name="half-rating-read"
              defaultValue={product?.avgRating}
              precision={0.5}
              readOnly
              size="large"
            />
          </div>

          <p className="mt-3 mb-3">Based on {product?.listOfReviews?.length} customer ratings</p>

          <div className={styles.eachStarRatingDiv}>
            <div className={styles.eachStartRating}>
              <p>5 star</p> 
              <LinearProgress variant="determinate" value={parseInt(fiveStarPercentage)} sx={{width:"100px"}}/>
              <p>{parseInt(fiveStarPercentage)}%</p>
            </div>

            <div className={styles.eachStartRating}>
              <p>4 star</p> 
              <LinearProgress variant="determinate" value={parseInt(fourStarPercentage)} sx={{width:"100px"}}/>
              <p>{parseInt(fourStarPercentage)}%</p>
            </div>

            <div className={styles.eachStartRating}>
              <p>3 star</p> 
              <LinearProgress variant="determinate" value={parseInt(threeStarPercentage)} sx={{width:"100px"}}/>
              <p>{parseInt(threeStarPercentage)}%</p>
            </div>

            <div className={styles.eachStartRating}>
              <p>2 star</p> 
              <LinearProgress variant="determinate" value={parseInt(twoStarPercentage)} sx={{width:"100px"}}/>
              <p>{parseInt(twoStarPercentage)}%</p>
            </div>

            <div className={styles.eachStartRating}>
              <p>1 star</p> 
              <LinearProgress variant="determinate" value={parseInt(oneStarPercentage)} sx={{width:"100px"}}/>
              <p>{parseInt(oneStarPercentage)}%</p>
            </div>
          </div>

          <p className="mt-3">We Would Love to know what you</p>
          <p>feel about the product.</p>
          <button className={styles.writeReview} onClick={()=>handleShow(product,null)}>Write a Review</button>
        </div>

        <div className={styles.customerReviewSummary}>

          {/* User's Review */}
          {myReview && (
            <div>
              <p style={{fontWeight:"bold"}}>Your Review for this product</p>
              <div className={`${styles.customerReviewBox} ${styles.editIconRelative}`}>
                  {/* User Display Data */}
                  <div className={styles.avatar}>

                    <Avatar sx={{ backgroundColor: "#ff5640" }}>
                      {(myReview?.user?.userName).slice(0, 1)}
                    </Avatar>

                    {/* User's Meta Data */}
                    <div className={styles.metaData}>
                      <p className={styles.userName}>{myReview?.user?.userName} <span><SuccessIcon className="facility-icon authenticated-user"/></span></p>
                      <div className={styles.userRating}>
                        <Rating
                          name="half-rating-read"
                          value={myReview?.rating}
                          readOnly
                          icon={<StarIcon sx={{ color: '#FFD700', stroke: 'gold', strokeWidth: 1.5 }} />} 
                          emptyIcon={<StarIcon sx={{ color: 'transparent', stroke: 'white', strokeWidth: 1 }} />}
                        />

                        <p className="ms-1">{myReview?.rating}</p>

                        <span className="ms-2 me-2">|</span>
                        <span >{formatDate(myReview?.createdAt)}</span>
                      </div>
                    </div>
                  </div>

                  <p className={styles.reviewTitle}>{myReview?.title}</p>

                  <div className={styles.comment}>
                    <p>{myReview?.comment}</p>
                  </div>
                  
                  <button className={styles.editBtn} onClick={() => handleShow(product, myReview)}>
                  <Tooltip title="Edit">
                    <EditIcon className={styles.editIcon}/>
                  </Tooltip>
                  </button>

              </div>
            </div>

          )}

          <p>Total Reviews : {product?.listOfReviews?.length}</p>

          {product?.listOfReviews?.map((review, index) => {
            return (
              <div key={index} className={styles.customerReviewBox}>
                {/* User Display Data */}
                <div className={styles.avatar}>

                  <Avatar sx={{ backgroundColor: "#ff5640" }}>
                    {(review?.user?.userName).slice(0, 1)}
                  </Avatar>

                  {/* User's Meta Data */}
                  <div className={styles.metaData}>
                    <p className={styles.userName}>{review?.user?.userName} <span><SuccessIcon className="facility-icon authenticated-user"/></span></p>
                    <div className={styles.userRating}>
                      <Rating
                        name="half-rating-read"
                        value={review?.rating}
                        readOnly
                        icon={<StarIcon sx={{ color: '#FFD700', stroke: 'gold', strokeWidth: 1.5 }} />} 
                        emptyIcon={<StarIcon sx={{ color: 'transparent', stroke: 'white', strokeWidth: 1 }} />}
                      />

                      <p className="ms-1">{review?.rating}</p>

                      <span className="ms-2 me-2">|</span>
                      <span >{formatDate(review?.createdAt)}</span>
                    </div>
                  </div>
                </div>

                <p className={styles.reviewTitle}>{review?.title}</p>

                <div className={styles.comment}>
                  <p>{review?.comment}</p>
                </div>

              </div>
            );
          })}

        </div>

      </div>
    </div>
  );
}

export default ProductReviews;
