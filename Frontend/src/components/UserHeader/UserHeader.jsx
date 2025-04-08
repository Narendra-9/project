import React, { useContext, useEffect, useState } from 'react'
import {Link, useNavigate} from "react-router-dom";
import Badge from '@mui/material/Badge';
import { styled } from '@mui/material/styles';
import IconButton from '@mui/material/IconButton';
import ShoppingCartOutlinedIcon from '@mui/icons-material/ShoppingCartOutlined';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import Tooltip from '@mui/material/Tooltip';
import SearchResult from '../SearchResult/SearchResult';
import "./UserHeader.css"
import LoginContainer from '../LoginContainer/LoginContainer';
import { UserConext } from '../../context/UserContext';
import UserDetailsDisplayInHeader from '../UserDetailsDisplay/UserDetailsDisplayInHeader';
import { CartContext } from '../../context/CartContext';
import SidePopUpCart from '../SidePopUpCart/SidePopUpCart';
import {ReactComponent as PremiumIcon} from "../../assets/premium-icon.svg"
import { debounce } from 'lodash';
import { ThemeContext } from '../../context/ThemeContext';

const StyledBadge = styled(Badge)(({ theme }) => ({
  '& .MuiBadge-badge': {
    right: -3,
    top: 1,
    padding: '0 4px',
    backgroundColor:"#ff5640"
  },
}));

function UserHeader() {

  const {user,openLogInPopUp,openPopUp,closePopUp}=useContext(UserConext);
  const {cart,openSideCart,wishList}=useContext(CartContext);
  const {isPremium}=useContext(ThemeContext)
  let [openSearch,setOpenSearch]=useState(false);
  let [notFound,setNotFound]=useState(false);
  let navigate=useNavigate();
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const cartItemsCount = cart?.cartItems?.length || 0;

  const fetchResults = debounce((query) => {
    if (query.trim()) {
      fetch(`${process.env.REACT_APP_GET_ALL_PRODUCTS_CONTAINING_KEYWORD}?keyword=${query}&page=0&size=4`)
        .then((response) => response.json())
        .then((data) => {
          setResults(data.body.content);
          if(data.body.content.length===0){
            setNotFound(true);
          }
          else{
            setNotFound(false)
          }
        })
        .catch((error) => {
          console.error('Error fetching search results:', error);
        });
    } else {
      setResults([]);
      setNotFound(false)
    }
  }, 500); 

  useEffect(() => {
    fetchResults(query);
    return () => {
      fetchResults.cancel();
    };
  }, [query]);
  
  function handleOpenSearch(){
    setOpenSearch(true);
  }

  function handleCloseSearch(){
    setTimeout(() => {
      setOpenSearch(false);
    }, 200);
  }

  return (
    <header className={isPremium?'user-navbar user-navbar-premium':'user-navbar'}>
      <div className='user-nav-bar-container'>

        <Link to='/' style={{textDecoration:"none"}}>
          <div className='logo'>

            {isPremium && (
              <PremiumIcon className="premium-icon-in-logo"/>
            )}

            <div className='en-logo'>
              <span style={{ fontWeight: "700", fontSize: "25px", color: "white",fontFamily:"DavaSans" }}>endava strength</span>{" "}
              <img src="https://companieslogo.com/img/orig/DAVA-d4ea9241.png?t=1632326300&download=true" height="30px" alt="logo" ></img>            
            </div>

          </div>
        </Link>


        <div className='search-bar-container'>
            <input className='search-bar' value={query} type='text' placeholder='Type a product name. e.g. Biozyme' name='search' onFocus={handleOpenSearch} onBlur={handleCloseSearch}  onChange={(e) => setQuery(e.target.value)}></input>
            {openSearch&&<SearchResult products={results} notFound={notFound}/>}
        </div>

        <div className='nav-bar-icons-container'>

          <Tooltip title="ES Cash">
              <IconButton aria-label="cart" onClick={()=>navigate("/users/escash")}>
                  <img src='/Escash2.png' alt='es-cash' height="25px"></img>
                  <span className='es-cash-amount'>{user?.esCashPoints}</span>
              </IconButton>
          </Tooltip>
          
          <Tooltip title="WishList">
              <IconButton aria-label="cart" onClick={()=>navigate("/users/wishlist")}>
                <StyledBadge badgeContent={wishList?.length} color="secondary">
                  <FavoriteBorderIcon style={{color:"white"}}/>
                </StyledBadge>
              </IconButton>
          </Tooltip>

          <Tooltip title="Cart">
          <Link to={"users/mycart"}>
              <IconButton aria-label="cart" className='me-2'>
                <StyledBadge badgeContent={cartItemsCount} color="secondary">
                  <ShoppingCartOutlinedIcon style={{color:"white"}}/>
                </StyledBadge>
              </IconButton>
          </Link>
          </Tooltip>

          {user?(<UserDetailsDisplayInHeader user={user}/>):<button className='login-btn' onClick={openPopUp}>Login/SignUp</button>}
        </div>

      </div>

      {openSearch&&<div className='search-overlay'></div>}

      {openLogInPopUp&&<div className='login-overlay'></div>}

      {openLogInPopUp&&<LoginContainer closePopUp={closePopUp}/>}

      {openSideCart&&<SidePopUpCart/>}

    </header>
  );
}

export default UserHeader