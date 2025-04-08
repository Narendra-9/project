import React, { useContext } from "react";
import styles from "./ProductCardSkeleton.module.css";
import Skeleton from "react-loading-skeleton";
import { ThemeContext } from "../../context/ThemeContext";

function ProductCardSkeleton({ count }) {
  const {isPremium}=useContext(ThemeContext)
  return Array(count)
    .fill(0)
    .map((element, index) => {
      return (
        <div key={index} className={isPremium? styles.premiumSkeleton : styles.skeleton}>
          <div className={styles.box1}>
            <Skeleton width="150px" height="150px" />
            <div className={styles.box2}>
              <Skeleton width="250px" className="mb-3" />
              <Skeleton width="250px" className="mb-3" />
              <Skeleton width="250px" className="mb-3" />
              <Skeleton width="250px" className="mb-3" />
            </div>
          </div>
          <div className={styles.box3}>
            <Skeleton width="210px" height="35px" />
            <Skeleton width="210px" height="35px" />
          </div>
        </div>
      );
    });
}

export default ProductCardSkeleton;
