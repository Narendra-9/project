export const getOrderStatusColor = (status) => {
    switch (status) {
      case "PLACED":
        return "red";
      case "Dispatched":
        return "#FFA500"; 
      case "Shipped":
        return "#8A2BE2";
      case "Delivered":
        return "#28A745";
      default:
        return "#6C757D"; 
    }
  };