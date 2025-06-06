import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import 'react-loading-skeleton/dist/skeleton.css'
import { BrowserRouter as Router } from "react-router-dom";
import { CartProvider } from "./context/CartContext";
import { UserProvider } from "./context/UserContext";
import { ThemeProvider } from "./context/ThemeContext";
import { SkeletonTheme } from "react-loading-skeleton";
// import reportWebVitals from './reportWebVitals';

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <Router>
    <UserProvider>
      <CartProvider>
        <ThemeProvider>
            <App />
        </ThemeProvider>
      </CartProvider>
    </UserProvider>
  </Router>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
// reportWebVitals();
