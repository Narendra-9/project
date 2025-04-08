import React from 'react'
import KeyboardArrowRightIcon from '@mui/icons-material/KeyboardArrowRight';
import HeadingWithBullet from '../HeadingWithBullet/HeadingWithBullet';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/navigation';
import { Navigation } from 'swiper/modules';
import VerticalProductCard from '../VerticalProductCard/VerticalProductCard';
import "./HomePageSectionContainer.css"
import { useNavigate } from 'react-router-dom';

function HomePageSectionContainer(props) {
    const {listOfProducts,sectionHeading,navigateTo}=props;
    let navigate=useNavigate();
  return (
    <section className='home-page-section-component'>
        <HeadingWithBullet heading={sectionHeading}/>
            <div className='apparel-swiper mt-5'>
              <Swiper
                modules={[Navigation]}
                slidesPerView={4}
                navigation
                className='ms-3'
                > 
                  {listOfProducts?.filter(product => !product?.slug.includes("mb-premium-membership-12-months")).map(product=>{
                        return (
                          <SwiperSlide key={product.productId}>
                              <VerticalProductCard product={product}/>
                          </SwiperSlide>
                        )
                      })}
              </Swiper>
            </div>

        <p className='see-all-products' onClick={()=>navigate(navigateTo)} >See All Products <KeyboardArrowRightIcon className='key-right-icon'/></p>

      </section>
  )
}

export default HomePageSectionContainer