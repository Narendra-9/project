import React, { useContext, useEffect,useRef,useState } from 'react'
import BannerCarousal from '../components/BannersCarousal/BannersCarousal'
import axios from 'axios';
import "../css/HomePage.css"
import KeyboardArrowRightIcon from '@mui/icons-material/KeyboardArrowRight';
import HeadingWithBullet from '../components/HeadingWithBullet/HeadingWithBullet';
import { useNavigate } from 'react-router-dom';
import HomePageSectionContainer from '../components/HomePageSection/HomePageSectionContainer';
import { ThemeContext } from '../context/ThemeContext';
import showToast from '../components/CustomToast/CustomToast';
import { LABELS } from '../config/labels';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/navigation';
import { Navigation } from 'swiper/modules';
import VerticalProductCard from '../components/VerticalProductCard/VerticalProductCard';

function HomePage() {
  const [categories, setCategories] = useState(null);
  const [apparelDisplayProducts,setApparelDisplayProducts]=useState(null);
  const [fitFoodsDisplayProducts,setFitFoodsDisplayProducts]=useState(null);
  const [newlyArrivedProducts,setNewlyArrivedProducts]=useState(null)
  const [lowStockProducts,setLowStockProducts]=useState(null);
  const [displayBanners,setDisplayBanners]=useState(null);
  const [bestSellingProducts,setBestSellingProducts]=useState(null);
  const [showBestSelling,setShowBestSelling] = useState(false);
  const navigate=useNavigate();
  const {isPremium}=useContext(ThemeContext)

  async function getHomePageContent(){
    try{
      let response = await axios.get(process.env.REACT_APP_GET_HOME_PAGE_CONTENT);
      setApparelDisplayProducts(response.data.body.apparelRangeProducts.content);
      setCategories(response.data.body.categoryDtoWithoutSubCategories);
      setFitFoodsDisplayProducts(response.data.body.fitFoodProducts.content);
      setNewlyArrivedProducts(response.data.body.newlyLaunchedProducts.content);
      setLowStockProducts(response.data.body.lowStockProducts.content);
      setDisplayBanners(response.data.body.displayBannerDtos)
    }
    catch(err){
      showToast(LABELS.defaultErrorMessage,"error")
    }
  }

  useEffect(()=>{
    getHomePageContent();
  },[])
  
  const isValidImageUrl = (url) => {
    return typeof url === "string" && 
          /^((https?:\/\/.*|\/)?.+\.(png|jpg|jpeg|gif|webp|svg))$/i.test(url);
  };

  const displayableCategories = categories
  ?.filter(category => isValidImageUrl(category?.categoryImgUrl))
  .slice(0, 5);

  const getBestSellingProducts= async ()=>{
    let response=await axios.get("http://localhost:8080/products/bestSelling?page=0&size=8");
    setBestSellingProducts(response.data.body.content)
  }

  const showBestSellingProducts=()=>{
    if(!bestSellingProducts){
      getBestSellingProducts();
    }
    setShowBestSelling(true);
  }

  const showCategories=()=>{
    setShowBestSelling(false)
  }

  return (
    <div className='home-page-container' style={{marginTop:"80px",color:"white"}}>


      <BannerCarousal displayBanners={displayBanners}/>

      <section className={isPremium?'home-page-popular-section-premium home-page-popular-section':'home-page-popular-section'}>
        <div className='home-page-popular-div'>


        
          <HeadingWithBullet heading={"Popular"}/>


          <div className='popular-section-buttons'>
            <button className={showBestSelling?'best-seller-btn popular-active':'best-seller-btn'} onClick={showBestSellingProducts}>Best Seller</button>
            <button className={!showBestSelling?'popular-section-category-btn popular-active ms-4':'popular-section-category-btn ms-4'} onClick={showCategories}>Categories</button>
          </div>


          {showBestSelling ? (
            <div className='home-page-best-selling mt-5'>
              <Swiper
                modules={[Navigation]}
                slidesPerView={4}
                navigation
                className='ms-3'
                > 
                  {bestSellingProducts?.filter(product => !product?.slug.includes("mb-premium-membership-12-months")).map(product=>{
                        return (
                          <SwiperSlide key={product.productId}>
                              <VerticalProductCard product={product}/>
                          </SwiperSlide>
                        )
                      })}
              </Swiper>
            </div>
          ):(
            <div className='category-display-container'>
            {displayableCategories?.map((category=>{
              return (
                <div key={category.categoryId} className='category-display-img-div ms-5' 
                      onClick={()=>navigate(`/categories/${category.categoryName}`)}>
                <p className='category-display-name text-center'>{category.categoryName}</p>
                  <img className='category-display-img' src={category.categoryImgUrl} alt='category-img' height="200px" width="200px"></img>
                </div>
              )
            }))}
          </div>

          )}

          <p className='see-all-products' onClick={()=>navigate("/categories")} >See All Products <KeyboardArrowRightIcon className='key-right-icon'/></p>
        
        </div>

      </section>

      <section className='home-page-shop-by-top-categories-section'>
        <HeadingWithBullet heading={"Shop by Top Categories"}/>
        <div className='top-categories-display-container mt-5'>
          <div className='top-category-card' onClick={()=>navigate("/sale/Biozyme")}>
            <p className='top-category-name'>Biozyme</p>
            <img src="https://img3.hkrtcdn.com/27426/prd_2742542-MuscleBlaze-Biozyme-Performance-Whey-4.4-lb-Rich-Chocolate_o.jpg" alt='biozyme' className='top-category-display-img'></img>
          </div>

          <div className='top-category-card'>
          <p className='top-category-name'>Creatine</p>
            <img src="https://img6.hkrtcdn.com/34083/prd_3408215-MuscleBlaze-Creatine-Monohydrate-CreAMP-Citrus-Blast-0.22-lb_o.jpg" alt='creatine' className='top-category-display-img'></img>
          </div>

          <div className='top-category-card' onClick={()=>navigate("/categories/Pre&Post Workout")}>
          <p className='top-category-name'>Pre Workout Range</p>
            <img src="https://img6.hkrtcdn.com/36087/prd_3608625-MuscleBlaze-Pre-Workout-WrathX-1.12-lb-Fruit-Fury_o.jpg" alt='creatine' className='top-category-display-img'></img>
          </div>
        </div>
      </section>

      <HomePageSectionContainer listOfProducts={apparelDisplayProducts} sectionHeading={"Apparel Range"} navigateTo={"/categories/apparel"}/>
      <HomePageSectionContainer listOfProducts={fitFoodsDisplayProducts} sectionHeading={"Fit Food Store"} navigateTo={"/categories/Fit Foods"}/>
      <HomePageSectionContainer listOfProducts={newlyArrivedProducts} sectionHeading={"New Arrivals"} navigateTo={"/sale/New Arrivals"}/>
      <HomePageSectionContainer listOfProducts={lowStockProducts} sectionHeading={"Fewer Stock"} navigateTo={"/sale/Fewer Stock"}/>
    </div>
  )
}

export default HomePage