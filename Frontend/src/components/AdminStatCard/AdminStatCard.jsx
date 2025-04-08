import React from "react";
import "./AdminStatCard.css"

const AdminStatCard = ({ count, name, Icon }) => {
  return (
    <div className="stat-card">
      <div className="stat-card-details">
        <p className="stat-count">{count}</p>
        <p className="stat-name">{name}</p>
      </div>
      <div className="stat-display-img">
        {Icon && <Icon className="stat-icon" />}
      </div>
    </div>
  );
};

export default AdminStatCard;
