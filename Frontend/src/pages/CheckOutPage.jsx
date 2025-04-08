import React, { useContext, useEffect, useState } from 'react'
import "../css/CheckOutPage.css"
import { CartContext } from '../context/CartContext';
import axios from 'axios';
import { UserConext } from '../context/UserContext';
import { useLocation, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { ThemeContext } from '../context/ThemeContext';
import MUIStepper from '../components/MUIStepper/MUIStepper';
import OrderSummary from '../components/OrderSummary/OrderSummary';
import MUIStepperPremium from '../components/MUIStepper/MUIStepperPremium';
import AddAddressPopUp from '../components/AddAddressPopUp/AddAddressPopUp';

function CheckOutPage() {
    const {earnRate,totalItems,totalBasePrice,totalDiscountedPrice}=useContext(CartContext);
    const {user}=useContext(UserConext);
    const {isPremium}=useContext(ThemeContext)
    const [userAddresses,setUserAddresses]=useState(null)
    const [selectedAddressId,setSelectedAddressId]=useState(null);    
    const navigate=useNavigate();
    const location=useLocation();
    const {orderTotal,pointsUsing}=location?.state || {orderTotal:totalDiscountedPrice,pointsUsing:0}
    const [addAddress, setAddAddress] = useState(false);
    const [editAddress,setEditAddress] = useState(false);
    const [addressToBeEdited,setAddressToBeEdited]=useState(null);
    
    useEffect(() => {
        async function getUserAddresses(){
            let response=await axios.get(`${process.env.REACT_APP_GET_ALL_USER_ADDRESSES}/${user?.userId}`);
            setUserAddresses(response.data.body)

            let defaultAddress=response.data.body.find(address=>address?.isDefault)
            if(defaultAddress){
                setSelectedAddressId(defaultAddress.userAddressId)
            }
        }
        if(user){
            getUserAddresses();
        }
    },[user])
    
    function handleAddressSelection(addressId){
        setSelectedAddressId(addressId);
    }

    function openAddAddressSection(){
        setAddAddress(true)
    }

    function openEditAddressSection(addres){
        setAddressToBeEdited(addres)
        setEditAddress(true)
    }


    function addInAddressState(addedAddress) {
        if (addedAddress.isDefault) {
            setUserAddresses((prev) => {
                const updatedAddresses = prev.map((i) =>
                    i.isDefault ? { ...i, isDefault: false } : i
                );
                return updatedAddresses; 
            });
        }
        setUserAddresses((prev) => [...prev, addedAddress]);
    }

    function editInAddressState(editedAddress){

        if (editedAddress.isDefault) {
            setUserAddresses((prev) => {
                const updatedAddresses = prev.map((i) =>
                    i.isDefault ? { ...i, isDefault: false } : i
                );
                return updatedAddresses; 
            });
        }
        
        setUserAddresses(prevUserAddress=>
            prevUserAddress.map(address=>
                address.userAddressId===editedAddress.userAddressId
                ?{...address,...editedAddress}
                :address
            )
        )
    }


    function closeAddAddressPopUp() {
        setAddAddress(false);
        setEditAddress(false);
        setAddressToBeEdited(null);
    }


    async function handleDelete(userAddressId){
        try{
            await axios.delete(`http://localhost:8080/user-address/delete/${userAddressId}`);
            let filteredAddresses=userAddresses.filter(address=>address?.userAddressId!==userAddressId)
            setUserAddresses([...filteredAddresses])
        }catch(e){
            console.log(e);
        }
      }

    function proceedToPay(){
        if(selectedAddressId){
            navigate(`/order?selectedAddress=${selectedAddressId}`,{
                state: {
                    orderTotal:orderTotal,
                    pointsUsing:pointsUsing
                }
            })
        }
        else{
            toast.error("Select Address to proceed ",{
                style:{
                        border:"1px solid white",
                        color:"white",
                        backgroundColor:"#30404B",
                        marginBottom:"10px"
                }
                ,iconTheme: {
                    primary: '#FF5640',
                    secondary: 'white',
                  },
                  position: 'bottom-center',
                  duration:1000
            })
        }
        
    }

    if(!totalItems || !totalBasePrice || !orderTotal ){
        return (
            <div className='empty-checkout'>
                <h2>Wait... Where’s the Fuel? 🤨</h2>
                <p className='tag-line'>"You can’t flex at checkout without loading up first! 🏋️‍♂️ Add some gains to your cart and let's lift this order!"</p>
                <button className='grab-supplements' onClick={()=>navigate("/")}>💪 Grab Your Supplements</button>
            </div>
        )
    }



  return (
    <div className={isPremium?'check-out-page-container check-out-page-container-premium':'check-out-page-container'}>

        <div className='check-out-left-container'>
            <OrderSummary pointsUsing={pointsUsing} orderTotal={orderTotal} totalItems={totalItems} earnRate={earnRate} totalBasePrice={totalBasePrice} totalDiscountedPrice={totalDiscountedPrice}/>
        </div>

        <div className='check-out-right-container'>
            <div className='checkout-page-stepper mt-4 mb-4'>
                {isPremium? (<MUIStepperPremium activeStep={1}/>):(<MUIStepper activeStep={1}/>)}
            </div>

            <div className='checkout-page-addresses'>
                {userAddresses?.map(address => {
                    return (
                    <div className='checkout-page-address-card mb-4' key={address.userAddressId}>
                        <div className='checkout-page-addrss-card-header'>
                            <p style={{fontWeight:"bold"}}>Address</p>
                            <div className='checkout-page-edit-remove-btns'>
                                
                                <button className='checkout-page-address-edit-btn' onClick={()=>openEditAddressSection(address)}>Edit</button>
                                {selectedAddressId!==address.userAddressId && (
                                    <button className='checkout-page-address-remove-btn' onClick={()=>handleDelete(address?.userAddressId)}>Remove</button>
                                )}
                                
                            </div>
                        </div>
                        <div className='checkout-page-address-card-user-name-phonenumber mt-2'>
                            <p className=''>{address?.fullName}</p>
                            <p className='ms-3'>{address?.mobileNo}</p>
                        </div>
                        <div className='checkout-page-address-card-user-address mt-1'>
                            <p>{address?.address}</p>
                        </div>
                        <div className='checkout-page-address-card-user-city'>
                            <p>{address?.city}</p>
                        </div>
                        <div className='checkout-page-address-card-user-state-pin'>
                            {address?.state} - {address?.pincode}
                        </div>
                        <div className='checkout-page-deliver-here-div mt-3 mb-2'>
                            <div className={selectedAddressId===address.userAddressId?'deliver-here-checkbox-div glow':'deliver-here-checkbox-div'}>
                                <input id={address.userAddressId} 
                                       value={address.userAddressId} 
                                       checked={selectedAddressId===address.userAddressId} 
                                       type='checkbox' 
                                       name='deliverHere' 
                                       className='deliver-here-checkbox' 
                                       onChange={()=>handleAddressSelection(address.userAddressId)}></input>
                                <label htmlFor={address.userAddressId} className='deliver-here-label'>Deliver Here</label>
                            </div>
                        </div>
                    </div>
                    )
                })}
            </div>

            <hr></hr>

            <div className='checkout-page-add-address-div'>
                <button className='check-out-page-add-address' onClick={openAddAddressSection}>+ Add new address</button>
            </div>

            <button className='checkout-page-proceed-to-pay-btn' onClick={proceedToPay}>PROCEED TO PAY</button>

        </div>

        {addAddress && <AddAddressPopUp closeAddAddressPop={closeAddAddressPopUp} addInAddressState={addInAddressState}/>}
        {editAddress && <AddAddressPopUp closeAddAddressPop={closeAddAddressPopUp} addressToBeEdited={addressToBeEdited} editInAddressState={editInAddressState}/>}

    </div>
  )
}

export default CheckOutPage