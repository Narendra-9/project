import axios from 'axios';
import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { UserConext } from './UserContext';
import Loading from '../components/Loading/Loading';
import { useLocation } from 'react-router-dom';
import toast from 'react-hot-toast';
import {EARN_RATE,PREMIUM_OFFER} from "../config/config"
import {LABELS} from "../config/labels"
import PropTypes from 'prop-types';
import showToast from '../components/CustomToast/CustomToast';

export const CartContext = createContext();

export function CartProvider({ children }) {

  // * User Context (User related data)
  const { user,openPopUp } = useContext(UserConext);
  
  // * Cart Context (Cart related data)
  const [cart, setCart] = useState(null);
  const [totalItems,setTotalItems]=useState(0);
  const [totalBasePrice,setTotalBasePrice] = useState(0);
  const [totalDiscountedPrice,setTotalDiscountedPrice]=useState(0);

  // * WishList 
  const [wishList,setWishList]=useState(null);

  // * Loading (To prevent Unnecessary ApiCalls)
  const [loading, setLoading] = useState(true);

  // * Side PopUp Cart
  const [openSideCart,setOpenSideCart]=useState(false);

  // * Predefined values from config file
  const earnRate=EARN_RATE;
  const premiumOffer=PREMIUM_OFFER;

  let location=useLocation();

  // ! clears the cart once order is successful
  const clearCart=useCallback(()=>{
    setCart(null);
  },[])

  // ! function to close sideCart
  const closeSideCart=useCallback(()=>{
    setOpenSideCart(false);
  },[])

  // ! Setting up the things in the context which will be used by the children (avoids props drilling)
  useEffect(() => {
    if (cart?.cartItems) {
      setTotalItems(cart?.cartItems.reduce((total, item) => total + item?.quantity, 0));
      setTotalBasePrice(cart?.cartItems.reduce((total, item) => total + (item?.product?.basePrice * (item?.quantity)), 0));
      let tempTotalDiscountedPrice=cart?.cartItems.reduce((total, item) => total + (item?.product?.discoutedPrice * (item?.quantity)), 0);
      if(user?.premiumActive){
        setTotalDiscountedPrice(parseInt(tempTotalDiscountedPrice*0.97));
      }
      else{
        setTotalDiscountedPrice(tempTotalDiscountedPrice);
      }
    }
  }, [cart,user]);

  // !  Fetching the Cart only when user is available
  useEffect(() => {
    if (user?.userId) {
      async function getCartDetails(userId) {
        try {
          let response = await axios.get(`${process.env.REACT_APP_CART_SERVICE_API}/get-cart?userId=${userId}`);
          setCart(response.data.body); 
        } catch (error) {
          toast.error("Something Went Wrong");
          console.error('Error fetching cart details:', error);
          setCart(null); 
        } finally {
          setLoading(false); 
        }
      }
      getCartDetails(user?.userId);
    }else{
      setLoading(false);
    }
  }, [user]);

  // !  Fetching the WishList only when user is available
  useEffect(() => {
    if(user?.userId){
      async function getWishList() {
        try{
          let response= await axios.get(`http://localhost:8080/wishlist/user/${user?.userId}`)
          setWishList(response.data.body);
        }
        catch (error) {
          toast.error("Something Went Wrong");
          console.error('Error fetching cart details:', error);
        }
        finally{
          setLoading(false);
        }
      }
      getWishList();
    }
    else{
      setLoading(false);
    }
  },[user])

  // ! Closing SidePopUp Cart when 
  // ! 1. There are no items in cart
  // ! 2. User is on cart page
  useEffect(() => {
    if (!cart || cart?.cartItems?.length === 0 || location.pathname.includes('/users/mycart')) {
      closeSideCart();
    }
  }, [cart, location.pathname,closeSideCart]); 

  // ? Remove this function and change the state in the client side rather than refetching it again..
  // ? Handle loading states where calling this function
  const reFetchCartDetails=useCallback(async (userId) => {
    try {
      let response = await axios.get(`http://localhost:8080/cart/get-cart?userId=${userId}`);
      setCart(response.data.body); // Assuming the cart data is in response.data.body
    } catch (error) {
      console.error('Error fetching cart details:', error);
      setCart(null); // Fallback to empty cart on error
    }
  },[])

  // ! Add to Cart function
  // ! Same function is used for Incrementing(quantity = 1) & Decrementing(quantity = -1)
  const addToCart=useCallback(async (productId,quantity)=>{ 
    /* When a user who is not logged in (i.e., user is null in the user context) 
    attempts to add an item to the cart, a login container is displayed, 
    prompting the user to log in before proceeding with the action. */
    if(!user){
      openPopUp(); // loginPopUp
      return;
    }

    // CartItemDto which is to be sent to backend as payLoad
    let CartItemDto={
        userId:user.userId,
        productId:productId,
        quantity:quantity,
    }

    try{
        // making a post call to add an item to cart
        let response=await axios.post(`${process.env.REACT_APP_CART_SERVICE_API}/add-to-cart`, JSON.stringify(CartItemDto), {
            headers: {
              'Accept': "application/json",
              "Content-Type": "application/json"
            }
        });

        // Setting the cart from the response directly instead of making an extra call for refetch as shown below (commented).
        setCart(response.data.body);

        // ? Refetching the cart once the item is added to reflect in the frontend.
        // ? reFetchCartDetails(user?.userId); 
        
        // opening the sideCart whenever a new item is added only when user is not on cart Page.
        if(!location.pathname.includes('/users/mycart')){
          setOpenSideCart(true);
        }
        
        // toasting the notification only when the user is not in cart page
        if(!location.pathname.includes('/users/mycart')){
          showToast("Added to Cart","success")
          }
    }
    catch(error){
        if(error.status===400){
          showToast("You only need one premium!","error")
        }
        else if(error.status===409){
          showToast("Already VIP! Save that cash! 😂","info")
        }
        else{
          showToast(LABELS.defaultErrorMessage,"error")
          console.error("Error Adding to Cart ", error)
        }
    }
    
  },[location.pathname,openPopUp,user])

  // ! Delete From Cart Function
  // ? Handle loading states where calling this function
  const deleteFromCart=useCallback(async (productId)=>{

    // Dto which is used to sent as payLoad to the backend
    let deleteFromCartRequestDto={
        userId:user?.userId,
        productId:productId
    }

    try{
        await axios.delete(`${process.env.REACT_APP_CART_SERVICE_API}/delete-from-cart`, {
            params: deleteFromCartRequestDto, // Sending as params, because delete request wont accept requestBody
            headers: {
                'Accept': "application/json",
                "Content-Type": "application/json"
            }
        });

        setCart((prevCart) => ({
          ...prevCart,
          cartItems: prevCart.cartItems.filter(i => i.product.productId !== productId)
        }));

        // ? Set State dynamically
        // reFetchCartDetails(user?.userId);
    }
    catch(err){
        toast.error("Something Went Wrong");
        console.error("Error Deleting the Cart " + err);
    }
  },[user?.userId])

  // ! Re-fetching the wishlist when a new item is added or removed to maintain consistency.
  const reFetchWishList=useCallback(async(userId)=>{
    let response= await axios.get(`${process.env.REACT_APP_WISHLIST_SERVICE_API}/user/${userId}`)
    setWishList(response.data.body);
  },[])

  // ! Move to WishList Function
  const moveToWishList=useCallback(async (productId) => {

    // Dto which is used to sent as payLoad to backend
    let cartItemDto={
      userId:user.userId,
      productId:productId,
    }

    try{
        await axios.post(`${process.env.REACT_APP_CART_SERVICE_API}/move-to-wishlist`, JSON.stringify(cartItemDto), {
            headers: {
              'Accept': "application/json",
              "Content-Type": "application/json"
            }
        });
        showToast("Moved to WishList","success")
        // ? change state dynamically
        reFetchCartDetails(user?.userId);
        reFetchWishList(user?.userId);
    }
    catch(error){
      // if customized error(i.e which i set in the backend to throw this error when item already exists)
      if(error.status===409){
        showToast("WishList Item Already Exists","error");
      }
      else{
        showToast(LABELS.defaultErrorMessage,"error");
        console.log("Error Moving to WishList ", error);
      }
    }
  },[user?.userId,reFetchWishList,reFetchCartDetails])

  // ! Add to WishList Function  
  const addToWishList=useCallback(async (productId)=> {
    /* When a user who is not logged in (i.e., user is null in the user context) 
    attempts to add an item to the cart, a login container is displayed, 
    prompting the user to log in before proceeding with the action. */
    if(!user){
      openPopUp();
      return;
    }

    // Dto used to sent as payLoad
    let wishListDto={
      userId:user?.userId,
      productId:productId,
    }
    try{
        await axios.post(`${process.env.REACT_APP_WISHLIST_SERVICE_API}/addToWishList`, JSON.stringify(wishListDto), {
            headers: {
              'Accept': "application/json",
              "Content-Type": "application/json"
            }
          })

          // ? Remove this thing and change state dynamically
          await reFetchWishList(user?.userId);
          
          toast.success(LABELS.wishListItemAdded,{
            style:{
                    border:"1px solid white",
                    color:"white",
                    backgroundColor:"#30404B"
            }
            ,iconTheme: {
                primary: '#FF5640',
                secondary: 'white',
              },
        })
    }
    catch(error){
      // if customized error(i.e which i set in the backend to throw this error when item already exists)
      if(error.status===409){
        toast.error(LABELS.wishListItemExists,{
          style:{
                border:"1px solid white",
                color:"white",
                backgroundColor:"#30404B"
            }
          ,iconTheme: {
              primary: '#FF5640',
              secondary: 'white',              },
        })
      }
      else{
          toast.error(LABELS.defaultErrorMessage);
          console.error(error)
      }
    }
  },[user,openPopUp,reFetchWishList])

  // ! Delete From WishList
  const deleteFromWishList=useCallback(async (wishListId)=>{
        try{
            await axios.delete(`${process.env.REACT_APP_WISHLIST_SERVICE_API}/deleteById/${wishListId}`)
            
            // ? Remove this thing and change state dynamically
            await reFetchWishList(user?.userId);
            
            showToast("Deleted from Wishlist","success")
        }
        catch(error){
            showToast(LABELS.defaultErrorMessage,"error");
            console.error(error);
        }
  },[user?.userId,reFetchWishList])

  // ! Move to Cart Function
  const moveToCart= useCallback(async (productId) => {

    // Dto used to sent as payLoad
    let wishListItemDto={
        userId:user?.userId,
        productId:productId,
    }
    
    try{
        await axios.post("http://localhost:8080/wishlist/move-to-cart", JSON.stringify(wishListItemDto), {
          headers: {
              'Accept': "application/json",
              "Content-Type": "application/json"
          }
          })

          showToast("Moved to Cart","success")
          // ? Remove this thing and change state dynamically
          await reFetchWishList(user?.userId);
          await reFetchCartDetails(user?.userId);
    }
    catch(error){
      if(error.status===409){
        showToast("Already Item Exists in Cart","error")
      }
      else{
        showToast(LABELS.defaultErrorMessage,"error")
        console.log("Error moving to Cart ", error)
      }
    }
  },[user?.userId,reFetchWishList,reFetchCartDetails])

  // ! Notify Function
  const handleNotify =useCallback( async (productId)=>{

    /* When a user who is not logged in (i.e., user is null in the user context) 
    attempts to notify, a login container is displayed, 
    prompting the user to log in before proceeding with the action. */
    if(!user){
      openPopUp();
      return;
    }

    // Dto used to sent as payLoad
    let productNotificationDto={
      productId : productId,
      userId : user?.userId,
    }

    try{
      await axios.post(`${process.env.REACT_APP_PRODUCT_NOTIFICATION_SERVICE}`, JSON.stringify(productNotificationDto), {
        headers: {
          'Accept': "application/json",
          "Content-Type": "application/json"
        }
      })

      showToast(LABELS.notificationAdded,"success");
    }
    catch(error){
      // if customized error(i.e which i set in the backend to throw this error when item already exists)
      if(error.status===409){
        showToast(LABELS.notificationExists,"error")
      }
      else{
          showToast(LABELS.defaultErrorMessage,"error")
          console.error(error)
      }
    }
    
  },[user,openPopUp])

  // ! To Avoid unnecessary re-renders, using useMemo
  const value = useMemo(() => ({
      cart,
      totalItems,
      totalBasePrice,
      totalDiscountedPrice,
      openSideCart,
      addToCart,
      closeSideCart,
      deleteFromCart,
      earnRate,
      moveToWishList,
      reFetchCartDetails,
      reFetchWishList,
      addToWishList,
      deleteFromWishList,
      moveToCart,
      clearCart,
      handleNotify,
      wishList,
      premiumOffer
    }), [
      cart,
      totalItems,
      totalBasePrice,
      totalDiscountedPrice,
      openSideCart,
      addToCart,
      closeSideCart,
      deleteFromCart,
      earnRate,
      moveToWishList,
      reFetchCartDetails,
      reFetchWishList,
      addToWishList,
      deleteFromWishList,
      moveToCart,
      clearCart,
      handleNotify,
      wishList,
      premiumOffer
  ]);

  // ! Until everting is ready not allowing the actual components to mount
  // ! This prevents unnecessary useEffect executions in childComponents
  if (loading) {  
    return <Loading />;
  }

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  );

}

// PropTypes for validation
CartProvider.propTypes = {
  // This will validate that children are passed as a valid React node
  children: PropTypes.node.isRequired, 
};