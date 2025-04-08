import toast from "react-hot-toast";

const customToastStyles = {
  border: "1px solid white",
  color: "white",
  backgroundColor: "#30404B",
};

const customIconTheme = {
  primary: "#FF5640",
  secondary: "white",
};

// ! I have made my Own Custom Toaster so that I can use them with my styles
const showToast = (message, type = "success") => {
  if (type === "success") {
    toast.dismiss();
    toast.success(message, {
      style: customToastStyles,
      iconTheme: customIconTheme,
    });
  } else if (type === "error") {
    toast.dismiss();
    toast.error(message, {
      style: customToastStyles,
      iconTheme: customIconTheme,
    });
  } else if (type === "info") {
    toast.dismiss();
    toast(message, {
      style: customToastStyles,
      iconTheme: customIconTheme,
    });
  }
};


export  default showToast;
