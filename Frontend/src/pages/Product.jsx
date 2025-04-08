import axios from 'axios';
import React, { useCallback, useContext, useEffect,useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/navigation';
import { Navigation } from 'swiper/modules';
import ReactImageMagnify from 'react-image-magnify';
import Divider from '@mui/material/Divider';
import StarIcon from '@mui/icons-material/Star';
import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import Typography from '@mui/material/Typography';
import Loading from '../components/Loading/Loading';
import "../css/Product.css"
import CurrencyFormatter from '../components/CurrencyFormatter/CurrencyFormatter';
import LocalShippingIcon from '@mui/icons-material/LocalShipping';
import Form from 'react-bootstrap/Form';
import CircularProgress from '@mui/material/CircularProgress';
import ExepectedDeliveyDate from '../components/ExpectedDeliveryDate/ExepectedDeliveyDate';
import ErrorIcon from '@mui/icons-material/Error';
import ProductDescription from '../components/ProductDescription/ProductDescription';
import { CartContext } from '../context/CartContext';
import {ReactComponent as SuccessIcon} from "../assets/success.svg"
import {ReactComponent as TruckIcon} from "../assets/transport-and-logistics.svg"
import {ReactComponent as WayFindingIcon} from "../assets/wayfinding.svg"
import {ReactComponent as PremiumIcon} from "../assets/premium-icon.svg"
import BreadCrumbs from '../components/BreadCrumbs/BreadCrumbs';
import {ReactComponent as BellIcon} from "../assets/notification.svg"
import ProductReviews from '../components/ProductReviews/ProductReviews';
import ProductRecommendations from '../components/ProductRecommendations/ProductRecommendations';



function Product() {
  let params = useParams();
  let slug = params.slug;
  let [product, setProduct] = useState(null);
  let [currentImg,setCurrentImg]=useState("");
  let [productVarients,setProductVarients] = useState([]);
  let offer;
  let navigate=useNavigate();
  let [quantity, setQuantity] = useState(1);
  let [pincodeError,setPinCodeError]=useState("");
  let [pincode,setPincode]=useState("");
  let [expectedDelivey,setExpectedDelivey] = useState(null);
  let [expectedDeliveyLoading,setExpectedDeliveyLoading] = useState(false);
  const {addToCart,premiumOffer,addToWishList,handleNotify}=useContext(CartContext);
  const WEATHER_API_ENDPOINT="https://api.openweathermap.org/data/2.5/weather"
  const API_KEY="01f3bd412dbf578fdf46ff3453e90a01"
  let productDescriptionJSON={};

  if(product){
    let offerFloat = ((product.basePrice-product.discountedPrice)/product.basePrice)*100;
    offer=Math.floor(offerFloat);
    // if(product?.productId===1){
    //   productDescriptionJSON=JSON.parse(product.description);
    // }
    // else{
    //   productDescriptionJSON=product.description;
    // }
      productDescriptionJSON=product.description;
  }


  const getProduct = useCallback(async () => {
    try {
      const response = await axios.get(`${process.env.REACT_APP_GET_PRODUCT_BY_SLUG}?slug=${slug}`);
      setProduct(response.data.body);
      setCurrentImg(response.data.body.listOfImages.filter(image=>image.primary)[0].url);
    } catch (error) {
      console.error('Error fetching product data:', error);
    }
  },[slug]);

  useEffect(() => {
    getProduct();
  }, [slug,getProduct]);


  useEffect(() => {
    if (product) {
      const getProductVarients = async () => {
        try {
          const encodedProductName = encodeURIComponent(product.productName);
          const response = await axios.get(`http://localhost:8080/products/productVariant?productName=${encodedProductName}`);
          setProductVarients(response.data.body);
        } catch (error) {
          console.error('Error fetching product variants:', error);
        }
      };
      getProductVarients();
    }
  }, [product]);

  if (!product) {
    return <Loading/>;
  }

  function handleImgSelect(currentImgUrl){
      setCurrentImg(currentImgUrl);
  }

  function goToProductVarient(slug){
    setProduct(null);
    navigate(`/products/${slug}`);
  }

  function handleQuantiyDecrement(){
    if(quantity>1){
      setQuantity(prev=>prev-1);
    }
    
  }

  function handleQuantiyIncrement(){
    setQuantity(prev=>prev+1);
  }


  function handlePinCodeInputChange(e){
    if(e.target.value.length<=6 && e.target.value>=0){
      setPincode(e.target.value);
    }
    if(e.target.value!==6){
        setExpectedDelivey("");
        setPinCodeError("");
    }
    

          
  }


  function predictDeliveryDelay(weatherData){
    const weatherDescription = weatherData.weather[0].description;
    let delay = 0;
    if (weatherDescription.includes("rain") || weatherDescription.includes("storm")) {
      console.log("Rain or storm detected! Delivery will likely be delayed.");
      delay = 2;
    }
    return delay;
  }

  async function handlePinCodeCheck(){
    try{
      if(pincode===""){
        setPinCodeError("Field Empty");
        return;
      }
      setExpectedDeliveyLoading(true)
      let pinCoderesponse =await axios.get(`https://api.postalpincode.in/pincode/${pincode}`)
      console.log(pinCoderesponse.data)
      if(pinCoderesponse.data[0].Status==="Error"){
        setPinCodeError("Invalid Pincode")
        setExpectedDeliveyLoading(false)
      }
      else{
        let state=pinCoderesponse.data[0].PostOffice[0].State;
        let region=pinCoderesponse.data[0].PostOffice[0].Region.split(" ")[0]
        console.log(region)
        console.log(`${WEATHER_API_ENDPOINT}?q=${region}&appid=${API_KEY}&units=metric`)
        let weatherAPIResponse=await axios.get(`${WEATHER_API_ENDPOINT}?q=${region}&appid=${API_KEY}&units=metric`);
        console.log(weatherAPIResponse.data);
        const encodedStateName = encodeURIComponent(state.trim());
        let myDeliveryApiResponse=await axios.get(`http://localhost:8080/delivery/expectedDelivery/${encodedStateName}`);
        let expectedDeliveryDaysCount=myDeliveryApiResponse.data.body+predictDeliveryDelay(weatherAPIResponse.data)
        setExpectedDelivey(expectedDeliveryDaysCount)
        setPinCodeError("")
        setExpectedDeliveyLoading(false)
      }
      
    }
    catch(error){
      if (error.response) {
        setExpectedDeliveyLoading(false)
        // Server responded with an error status code
        const statusCode = error.response.status;
        const errorMessage = error.response.data.errorMessage || 'An error occurred';

        // Handle specific status codes (like 404)
        if (statusCode === 404) {
          setPinCodeError("Not Serviceable")
        } else if (statusCode === 400) {
            alert(`Bad Request: ${errorMessage}`);
        } else if (statusCode === 500) {
            alert(`Server Error: ${errorMessage}`);
        } else {
            alert(`Unexpected Error: ${errorMessage}`);
        }
    } else if (error.request) {
        // No response received from the server
        alert('No response from the server. Please try again later.');
    } else {
        // Other errors (like setting up the request)
        alert('An error occurred while setting up the request.');
    }

    }
  }

  

  return (
    <div className='product-container'>

      {!(product?.productName.toLowerCase().includes("premium membership")) && (
        <div className='row mb-2'>
        <div className='col'>
          <BreadCrumbs link1={`/categories/${product.subCategory.category.categoryName}`} text1={product.subCategory.category.categoryName} link2={`/categories/${product.subCategory.category.categoryName}`} text2={product.subCategory.subCategoryName} text3={product.productName.slice(0,35)}/>
        </div>
        </div>
      )}


      <Divider style={{color:"white",backgroundColor:"white"}}/>

      <div className='row mt-3'>
        <div className='col-lg-5'>
          <div className='primary-img-container'>
          <ReactImageMagnify {...{
              smallImage: {
                      alt: 'Wristwatch by Ted Baker London',
                      height: 400,
                      width:400,
                      src: currentImg
                  },
              largeImage: {
                      src: currentImg,
                      width: 1200,
                      height: 1200
                  },
              fadeDurationInMs:0,
              hoverDelayInMs:0,
              enlargedImageContainerDimensions:{width:"130%",height:"100%"},
              enlargedImageContainerStyle:{zIndex:10}
              }} />
              </div>
          <div style={{width:"400px"}} className='img-slider mt-3'>
                <Swiper
                  modules={[Navigation]}
                  slidesPerView={4}
                  navigation
                  > 
                  {product?.listOfImages && product?.listOfImages.length > 0 ? (
                  product?.listOfImages.map((image, index) => (
                    <SwiperSlide className='slider-img' onClick={()=>handleImgSelect(image.url)}>{<img key={index} src={image.url} alt='product-image' height='100px' />}</SwiperSlide>
                  ))
                ) : (
                  <p>No images available</p>
                )}
                </Swiper>

            <div className='ingredients-img mt-5'>
                <img src={product?.listOfImages[1].url} alt='ingredients-img' height="400px"></img>
            </div>

          </div>
        </div>

        <div className='col-lg-7' style={{color:"white"}}>
                {!(product?.productName.toLowerCase().includes("premium membership")) && (
                  <p>{product.subCategory.subCategoryName}</p>
                )}
                <h2 style={{color:"#ff5640"}}>{product.productName}</h2>
                <div style={{display:"flex",alignItems:"baseline"}}>
                  <p>4.5</p>
                  <StarIcon style={{height:"12px"}}/>
                  <span style={{fontSize:'13px',color:"grey"}}>(Total {product.listOfReviews.length} Reviews)</span>
                </div>
                <p style={{marginTop:"-10px"}}>MRP:&nbsp;&nbsp;&nbsp;<span style={{textDecoration:"line-through",fontSize:"18px"}}>&#8377;{product.basePrice}</span></p>
                <p style={{marginTop:"-20px"}}><span style={{fontWeight:"500",fontSize:"25px"}}>Price:</span><span style={{marginLeft:"10px",fontSize:"25px"}}>&#8377;{product.discountedPrice}</span><span style={{marginLeft:"5px"}}>(<span style={{color:"#6CE14F"}}>{offer}% OFF</span>)</span></p>
                <p style={{marginTop:"-20px"}}>Inclusive all Taxes</p>
                <p className='product-page-premium-price' onClick={()=>navigate("/loyality")}>&#8377;{parseInt(product.discountedPrice-(premiumOffer*product.discountedPrice)/100)} with <PremiumIcon style={{height:"23px",width:"auto",marginLeft:"5px"}}/></p>

                {product?.stockQuantity===0 && <p style={{fontSize:"20px",color:"red"}}>Out Of Stock !</p>}
                {(product?.stockQuantity!==0 && product?.stockQuantity<10)  && <p style={{fontSize:"20px",color:"red"}}>Hurry Up !, Only {product?.stockQuantity} left</p>}
                
                <Accordion className='product-varients-accrodian'>
                  <AccordionSummary
                    expandIcon={<ExpandMoreIcon />}>
                    <Typography component="span" style={{color:"white"}}>Flavors & Quantity</Typography>
                  </AccordionSummary>
                  <AccordionDetails>
                    {productVarients.map((productVarient) => {

                      const isSelected = productVarient?.slug === slug;
                      return (
                        <button 
                                key={productVarient?.productId}
                                onClick={()=>goToProductVarient(productVarient?.slug)}
                                disabled={isSelected}
                                style={{background:isSelected?"#ff5640":"none"}}
                                className='product-varient-button'>
                                <p style={{margin:"0"}}>{productVarient.flavour} {productVarient.weight}</p>
                                <CurrencyFormatter amount={productVarient.discountedPrice}/>
                                </button>
                      )
                    })}
                  </AccordionDetails>
                </Accordion>


                <div className='row mt-5'>
                    <div className='col-lg-6 d-flex justify-content-between align-items-baseline'>
                        <p style={{height:'25px',width:"150px"}}>Select Quantity</p>
                        <div className='change-quantity-container'>
                            <button className='minus-button' onClick={handleQuantiyDecrement}>-</button>
                            {quantity}
                            <button className='plus-button'  onClick={handleQuantiyIncrement}>+</button>
                        </div>
                    </div>
                    <div className='col-lg-6 d-flex flex-column align-items-center justify-content-center'>

                        {product?.stockQuantity===0 ? (
                          <button className='product-add-to-cart-button product-notify-me-btn' onClick={()=>handleNotify(product?.productId)}><BellIcon className='card-bell-icon me-2'/> <span>NOTIFY ME</span></button>
                        ):(
                          <button className='product-add-to-cart-button' onClick={()=>addToCart(product?.productId,quantity)}>ADD TO CART</button>
                        )}

                        <button className='product-buy-now-button mt-3' onClick={()=>addToWishList(product?.productId)}>ADD TO WISHLIST</button>
                    </div>
                </div>
                
                <div className='row mt-3'>
                    <div className='col-lg-10'>
                          <LocalShippingIcon/><span style={{marginLeft:"5px",fontSize:"15px"}}>Delivery to</span>
                          <p style={{fontSize:'12px'}} className='mt-2'>Enter the pincode to check Delivery Date</p>
                          <div className='row'> 
                            <div className='col d-flex align-items-center'>
                              <Form.Control  type="number" placeholder="Enter Pincode" className='pincode-input' onChange={handlePinCodeInputChange} value={pincode} style={{width:"400px"}}/>
                              
                              <span className='ms-2 check' onClick={handlePinCodeCheck}>{expectedDeliveyLoading ? (<CircularProgress />):("Check")}</span>
                            </div>
                          </div>
                          {pincodeError&&<p className='pincode-error-msg mt-3'><ErrorIcon className='ms-2'/><span className='ms-2'>{pincodeError}</span></p>}
                          {(!pincodeError && expectedDelivey)&&<ExepectedDeliveyDate expectedDelivey={expectedDelivey}/>}
                    </div>
                </div>

                <div className='row mt-5'>
                  <div className='col-3 '>
                    <div className='facilities-product-div'>
                        <SuccessIcon className="facility-icon"/>
                        <p style={{margin:"0px"}}>Authentic products</p>
                    </div>
                  </div>

                  <div className='col-4 '>
                    <div className='facilities-product-div'>
                        <WayFindingIcon className="facility-icon"/>
                        <p style={{margin:"0px"}}>14 days returnable</p>
                    </div>
                  </div>


                  <div className='col-4'>
                    <div className='facilities-product-div'>
                        <TruckIcon className="facility-icon"/>
                        <p style={{margin:"0px"}}>Free Shipping</p>
                    </div>
                  </div>
                </div>

                <div className='row mt-5'>
                  <div className='col'>
                    <img src="/image.png" alt="" width="100%" height="auto"></img>
                  </div>
                </div>
        </div>
      </div>
      

      <ProductDescription productDescription={productDescriptionJSON}/>

      <ProductRecommendations categoryName={product?.subCategory?.category?.categoryName}/>
      
      <ProductReviews product={product} getProduct={getProduct}/>

    </div>
  );
}

export default Product;
