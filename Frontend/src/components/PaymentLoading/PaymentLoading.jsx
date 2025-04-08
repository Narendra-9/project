import React from "react";
import { motion } from "framer-motion";
import "./PaymentLoading.css"; // Import external styles

export default function PaymentLoading() {
  return (
    <div className="payment-container">
      {/* Rotating Card Animation */}
      <motion.div
        className="card"
        animate={{ rotateY: [0, 180, 360] }}
        transition={{ repeat: Infinity, duration: 1.5, ease: "easeInOut" }}
      >
        <div className="card-inner">
          <div className="card-chip"></div>
          {/* <span className="card-text">Processing...</span> */}
        </div>
      </motion.div>

      {/* Loading Dots */}
      <div className="loading-dots">
        {[0, 1, 2].map((i) => (
          <motion.span
            key={i}
            className="dot"
            animate={{ opacity: [0.3, 1, 0.3] }}
            transition={{ repeat: Infinity, duration: 0.8, delay: i * 0.2 }}
          />
        ))}
      </div>

      {/* Payment Text */}
      <p className="processing-text">Your payment is being processed...</p>
    </div>
  );
}
