import React from "react";
import styles from "./AdminOrderNotification.module.css";


function AdminOrderNotification({ notification }) {
  return (
    <div className={styles.avatar}>
    
      <div className={styles.circle}>{(notification?.message?.userName).slice(0,1)}</div>
      
      <div className={styles.content}>
        <p className={styles.title}>{notification?.message?.userName}</p>
        <p className={styles.text}>Placed a new Order #{notification?.message?.orderId}</p>
      </div>

    </div>
  );
}

export default AdminOrderNotification;
