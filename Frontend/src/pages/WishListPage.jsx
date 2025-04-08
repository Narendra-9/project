import React, { useContext } from 'react'
import "../css/WishListPage.css"
import {ReactComponent as DeleteIcon} from "../assets/trash.svg"
import { useNavigate } from 'react-router-dom';
import { CartContext } from '../context/CartContext';
import ShoppingCartOutlinedIcon from '@mui/icons-material/ShoppingCartOutlined';
import { ThemeContext } from '../context/ThemeContext';




function WishListPage() {
    const {wishList,deleteFromWishList,moveToCart}=useContext(CartContext);
    const {isPremium}=useContext(ThemeContext)
    let navigate=useNavigate();
    function formatDate(date){
        const formattedDate = new Date(date).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
        return formattedDate;
    }

    if (!wishList ||  wishList?.length === 0) {
        return (
            <div className='wishlist-empty-message'>
                <h2>Oops! 🏋️‍♂️</h2>
                <p className='tag-line'>"Your wishlist is running on empty—just like a workout without protein! 🥤 Add some gains fuel now!"</p>
                <button className='browse-products-btn' onClick={() => navigate("/")}>🔥 Stock Up on Supplements</button>
            </div>
        );
    }
    
    
    
return (
    <div className='wish-list-page-container'>
        <div className='wish-list-breadcrumps' style={{marginTop:"120px"}}>
            <p style={{fontSize:"18px",display:"flex"}}><span onClick={()=>navigate("/")} className='me-2'>Home</span> / <span style={{color:"#FF5640",marginLeft:"10px"}}>Wishlist</span></p>
        </div>
        <div className='wish-list-items-container mt-5'>
            <div className='row'>
                {wishList?.map(item=>{
                    return (
                        <div className='col-lg-6 mb-4' key={item.wishListItemId}>
                        <div className={isPremium?'wish-list-item-card wish-list-item-card-premium':'wish-list-item-card'} onClick={()=>navigate(`/products/${item?.product?.slug}`)}>
                            <img src={item?.product?.primaryImageUrl} alt='item-img' height="200px" className='wish-list-item-img'></img>
                                <div className='wish-list-item-content mt-2'>
                                <p className='wish-list-item-name'>{item?.product?.productName}</p>
                                <div className='wish-list-price-container'><span className='wish-list-item-price me-2'>&#8377;{item?.product?.discoutedPrice}</span>You Save<span className='wish-list-item-save-price ms-1'>&#8377;{item.product.basePrice-item.product.discoutedPrice}</span></div>
                                <div className='wish-list-item-card-buttons-div'>

                                    <div className='wish-list-item-move-to-cart' onClick={(e)=>{
                                        e.stopPropagation();
                                        moveToCart(item?.product?.productId);
                                    }}>
                                        <ShoppingCartOutlinedIcon className="wish-list-item-cart-icon mb-1" /><span className='move-to-cart-text' style={{marginBottom:"1px"}}> Move To Cart</span>
                                    </div>
                                    
                                    <div className='wish-list-item-date-delete-btn'>
                                        <p style={{margin:"0"}}><span style={{fontWeight:"600"}}>Added </span><span>on {formatDate(item?.createdAt)}</span> | <span><button className='wish-list-item-delete-btn' onClick={(e)=>{
                                            e.stopPropagation();
                                            deleteFromWishList(item?.wishListItemId);
                                            }}><DeleteIcon className="wish-list-delete-icon"/></button></span></p>
                                    </div>
                                </div>
                                
                            </div>
                        </div>
                            
                        </div>
                    )
                })}
            </div>
        </div>
    </div>
)
}

export default WishListPage