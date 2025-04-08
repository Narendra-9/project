import axios from 'axios';
import React, { useEffect, useState } from 'react'
import HeadingWithBullet from '../HeadingWithBullet/HeadingWithBullet';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/navigation';
import styles from "./ProductRecommendations.module.css"
import { Navigation } from 'swiper/modules';
import VerticalProductCard from '../VerticalProductCard/VerticalProductCard';

function ProductRecommendations({categoryName}) {
    const [recommendedProducts,setRecommendedProducts] = useState(null);

    useEffect(()=>{
        const getRecommendedProducts = async () => {
            const response = await axios.get(`http://localhost:8080/products/${categoryName}/bestSelling?page=0&size=8`);
            setRecommendedProducts(response.data.body.content);
        }
        getRecommendedProducts();
    },[categoryName])

  return (
    <div className={styles.productRecommendations}>
        <HeadingWithBullet heading={"You might also like "}/>
            <div className='mt-5'>
              <Swiper
                modules={[Navigation]}
                slidesPerView={4}
                navigation
                className='ms-3'
                > 
                  {recommendedProducts?.filter(product => !product?.slug.includes("mb-premium-membership-12-months")).map(product=>{
                        return (
                          <SwiperSlide key={product.productId}>
                              <VerticalProductCard product={product}/>
                          </SwiperSlide>
                        )
                      })}
              </Swiper>
            </div>
    </div>
  )
}

export default ProductRecommendations