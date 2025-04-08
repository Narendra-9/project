import {Route, Routes, Navigate, useLocation}  from "react-router-dom";
import './App.css';
import AdminPage from "./pages/AdminPage";
import 'bootstrap/dist/css/bootstrap.min.css';
import AddCategoryPage from "./pages/AddCategoryPage";
import EditCategoryPage from "./pages/EditCategoryPage";
import AddProduct from "./pages/AddProduct";
import EditProduct from "./pages/EditProduct";
import ManageUsers from "./pages/ManageUsers";
import ErrorPage from "./pages/ErrorPage";
import UserHeader from "./components/UserHeader/UserHeader";
import Product from "./pages/Product";
import ManageDeliveryLocationsPage from "./pages/ManageDeliveryLocationsPage";
import AdminHeader2 from "./components/AdminHeader/AdminHeader2";
import UserProfilePage from "./pages/UserProfilePage";
import CartPage from "./pages/CartPage";
import ManageProductsPage from "./pages/ManageProductsPage";
import WishListPage from "./pages/WishListPage";
import {Toaster} from "react-hot-toast";
import ManageBannerPage from "./pages/ManageBannerPage";
import LoyalityPage from "./pages/LoyalityPage";
import HomePage from "./pages/HomePage";
import ESCashPage from "./pages/ESCashPage";
import CategoriesPage from "./pages/CategoriesPage";
import CategoryProductsPage from "./pages/CategoryProductsPage";
import SaleProductsPage from "./pages/SaleProductsPage";
import CheckOutPage from "./pages/CheckOutPage";
import OrderPaymentPage from "./pages/OrderPaymentPage";
import MockPaymentRequest from "./pages/MockPaymentRequest";
import ViewOrderDetailsPage from "./pages/ViewOrderDetailsPage";
import PrivateRoute from "./components/PrivateRoute";
import ManageOrders from "./pages/ManageOrders";
import { SkeletonTheme } from "react-loading-skeleton";
import { useContext } from "react";
import { ThemeContext } from "./context/ThemeContext";
import ScrollToTop from "./components/ScrollToTop/ScrollToTop";


function App() {
  const location = useLocation();
  const isAdminRoute = location.pathname.startsWith('/admin');

  const {isPremium}=useContext(ThemeContext);

  if (!sessionStorage.getItem("welcomeMessageShown")) {
    console.log("%cWelcome to Endava Strength", "color: #FF5640; font-size: 22px;");
    sessionStorage.setItem("welcomeMessageShown", "true");
  }
  
  return (
    
    <SkeletonTheme baseColor={isPremium?"black":"#47555F"} highlightColor={isPremium?"grey":"#5E6A73"}>
    <div className="App">
    {!(location.pathname.startsWith('/mockpayment'))&&(
      isAdminRoute ?<AdminHeader2/>:<UserHeader/>
    )}
      <Toaster/>
      <ScrollToTop/>
      <Routes>
          {/* Admin Routes */}
          <Route path="/admin/home" element={ <PrivateRoute role="ADMIN"><AdminPage/></PrivateRoute>}></Route>
          <Route path="/admin/add-category" element={ <PrivateRoute role="ADMIN"><AddCategoryPage/></PrivateRoute>}></Route>
          <Route path="/admin/edit-category" element={ <PrivateRoute role="ADMIN"><EditCategoryPage/></PrivateRoute>}></Route>
          <Route path="/admin/add-product" element={ <PrivateRoute role="ADMIN"><AddProduct/></PrivateRoute>}></Route>
          <Route path="/admin/manage-products" element={ <PrivateRoute role="ADMIN"><ManageProductsPage/></PrivateRoute>}></Route>
          <Route path="/admin/edit-product" element={ <PrivateRoute role="ADMIN"><EditProduct/></PrivateRoute>}></Route>
          <Route path="/admin/manage-users" element={ <PrivateRoute role="ADMIN"><ManageUsers/></PrivateRoute>}></Route>
          <Route path="/admin/manage-banners" element={ <PrivateRoute role="ADMIN"><ManageBannerPage/></PrivateRoute>}></Route>
          <Route path="/admin/manage-orders" element={ <PrivateRoute role="ADMIN"><ManageOrders/></PrivateRoute>}></Route>
          <Route path="/admin/manage-delivery-locations" element={<PrivateRoute role="ADMIN"><ManageDeliveryLocationsPage/></PrivateRoute>}></Route>

          {/* Public Routes */}
          <Route path="/loyality" element={<LoyalityPage/>}></Route>
          <Route path="/home" element={<HomePage/>}></Route>
          <Route path="/" element={<Navigate to="/home" replace />} />
          <Route path="/products/:slug" element={<Product/>}></Route>
          <Route path="/categories" element={<CategoriesPage/>}></Route>
          <Route path="/categories/:category" element={<CategoryProductsPage/>}></Route>
          <Route path="/sale/:section" element={<SaleProductsPage/>}></Route>
          <Route path="/users/escash" element={<ESCashPage/> }></Route>
          <Route path="*" element={<ErrorPage/>}></Route>

          {/* User Routes */}
          <Route path="/account/MyAccount" element={ <PrivateRoute role={["USER","ADMIN"]}><UserProfilePage/></PrivateRoute>}></Route>
          <Route path="/users/mycart" element={ <PrivateRoute role={["USER","ADMIN"]}><CartPage/></PrivateRoute>}></Route>
          <Route path="/checkout" element={ <PrivateRoute role={["USER","ADMIN"]}><CheckOutPage/></PrivateRoute>}></Route>
          <Route path="/users/wishlist" element={ <PrivateRoute role={["USER","ADMIN"]}><WishListPage/></PrivateRoute>}></Route>
          <Route path="/order" element={ <PrivateRoute role={["USER","ADMIN"]}><OrderPaymentPage/></PrivateRoute>}></Route>
          <Route path="/orders/details" element={ <PrivateRoute role={["USER","ADMIN"]}><ViewOrderDetailsPage/></PrivateRoute>}></Route>
          <Route path="/mockpayment" element={ <PrivateRoute role={["USER","ADMIN"]}><MockPaymentRequest/></PrivateRoute>}></Route>
          
      </Routes>
    </div>
    </SkeletonTheme>
  );
}

export default App;
