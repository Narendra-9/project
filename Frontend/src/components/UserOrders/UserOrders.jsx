import React, { useCallback, useContext, useEffect, useState } from "react";
import "./UsersOrders.css";
import axios from "axios";
import { UserConext } from "../../context/UserContext";
import HeadingWithBullet from "../HeadingWithBullet/HeadingWithBullet";
import OrderAccordian from "../OrderAccordian/OrderAccordian";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import { LABELS } from "../../config/labels";
import showToast from "../CustomToast/CustomToast";
import UserOrderSkeleton from "../UserOrderSkeleton/UserOrderSkeleton";
import AddReviewModal from "../AddReviewModal/AddReviewModal";


function UserOrders() {
  // * User
  const { user } = useContext(UserConext);
  let userId = user?.userId;

  // * Order Related States (pagination)
  let [userOrders, setUserOrders] = useState([]);
  let [page, setPage] = useState(0);
  let [hasMore, setHasMore] = useState(true);
  let [totalElements, setTotalElements] = useState(null);

  // * Loading
  let [loading, setLoading] = useState(false);

  // * AddReviewModal Related
  const [show, setShow] = useState(false);
  const [toBeReviewProduct,setToBeReviewProduct] = useState(null);
  const handleClose = () => setShow(false);
  const handleShow = (product) => {
    setToBeReviewProduct(product)
    setShow(true)
  }

  //  ! Function to get all orders of users
  const getUserOrders = useCallback(async (currentPage) => {
    try {
      setLoading(true);
      let response = await axios.get(
        `${process.env.REACT_APP_ORDER_SERVICE_API}/user?userId=${userId}&page=${currentPage}&size=10&sort=createdAt,desc`
      );
      // Setting the total elements count
      setTotalElements(response.data.body.totalElements);
      // Setting the next set of orders when user clicks on loadmore
      setUserOrders((prev) => [...prev, ...response.data.body.content]);
      // If it is last page, setting the hasMore as false.
      if (response.data.body.last) {
        setHasMore(false);
      }
    } catch (err) {
      showToast(LABELS.defaultErrorMessage, "error");
      console.log(err);
    } finally {
      setLoading(false);
    }
  },[userId])

  useEffect(() => {
    if (userId) {
      setUserOrders([]);
      setPage(0);
      setHasMore(true);
      getUserOrders(0);
    }
  }, [userId,getUserOrders]);

  function handleLoadMore() {
    let nextPage = page + 1;
    setPage(nextPage);
    getUserOrders(nextPage);
  }

  return (
    <div className="user-orders-container pt-5">

      <AddReviewModal show={show} handleClose={handleClose} product={toBeReviewProduct}/>
      <HeadingWithBullet heading={"My Orders"} />

      <p>Total Orders : {totalElements}</p>

      <div className="user-orders-list mt-3">
        {userOrders?.map((order, index) => {
          return <OrderAccordian key={order?.id || index} order={order} handleShow={handleShow}/>;
        })}
      </div>

      

      {loading && <UserOrderSkeleton count={5}/>}

      <div className="load-more-div">
        {hasMore ? (
          <button
            className="user-orders-load-more-btn"
            onClick={handleLoadMore}
          >
            Load More
            <KeyboardArrowDownIcon />
          </button>
        ) : (
          <p>No more orders left — time to make some gains !</p>
        )}
      </div>
    </div>
  );
}

export default UserOrders;
