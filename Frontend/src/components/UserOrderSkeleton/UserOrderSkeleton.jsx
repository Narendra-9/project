import React from "react";
import Skeleton from "react-loading-skeleton";
import styles from "./UserOrderSkeleton.module.css";
function UserOrderSkeleton({ count }) {
  return Array(count)
    .fill(0)
    .map((element,index) => {
        return (
            <div key={index} className={styles.userOrderSkeleton}>
            <div className={styles.left}>
              <Skeleton circle width={30} height={30} />
              <div className="ms-3">
                <Skeleton width="300px" />
                <Skeleton width="250px" height="20px" />
              </div>
            </div>
            <div className={styles.right}>
              <Skeleton width="300px" className="me-3" />
            </div>
          </div>
        )
    });
}

export default UserOrderSkeleton;
