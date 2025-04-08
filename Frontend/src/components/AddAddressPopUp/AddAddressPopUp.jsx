import React, { useContext, useEffect, useState } from 'react'
import UserAddressInput from '../UserAddressInput/UserAddressInput'
import {ReactComponent as CloseIcon} from "../../assets/close.svg"
import { UserConext } from '../../context/UserContext';
import axios from 'axios';
import showToast from '../CustomToast/CustomToast';
import InputErrorMessage from '../InputErrorMessage/InputErrorMessage';
import { LABELS } from '../../config/labels';

function AddAddressPopUp(props) {
  const {closeAddAddressPop,addressToBeEdited,addInAddressState,editInAddressState}=props;

  const {user}=useContext(UserConext);
  const [pincodeDataLoading,setPincodeDataLoading] = useState(false);
  const [errors, setErrors] = useState({});

  let [addressInput,setAddAddressInput] =useState({
    userId:user?.userId || "",
    fullName:user?.userName||"",
    email:user?.userEmail||"",
    mobileNo:user?.phoneNumber  ||"",
    address:"",
    locality:"",
    pincode:"",
    city:"",
    state:"",
    isDefault:false
  })

  useEffect(() => {
    if (addressToBeEdited) {
      setAddAddressInput({
        userAddressId: addressToBeEdited.userAddressId || "",
        userId: user?.userId || "",
        fullName: addressToBeEdited.fullName || "",
        email: addressToBeEdited.email || "",
        mobileNo: addressToBeEdited.mobileNo || "",
        address: addressToBeEdited.address || "",
        locality: addressToBeEdited.locality || "",
        pincode: addressToBeEdited.pincode || "",
        city: addressToBeEdited.city || "",
        state: addressToBeEdited.state || "",
        isDefault: addressToBeEdited.isDefault || false
      });
    }
  }, [addressToBeEdited, user?.userId]);
  

  async function handleInputChange(e){

    if((e.target.name==="mobileNo" || e.target.name==="pincode")){
      if(/^[0-9]+$/.test(e.target.value) || e.target.value===""){
        setAddAddressInput({...addressInput,[e.target.name]:e.target.value})
      }
      else{
        return
      } 
    }
    else{
      setAddAddressInput({...addressInput,[e.target.name]:e.target.value})
    }
      setErrors({...errors,[e.target.name]:""})
  }

  function handleCheckBoxChange(e) {
    const { name, value, type, checked } = e.target;
    setAddAddressInput({
      ...addressInput,
      [name]: type === "checkbox" ? checked : value,
    });
  }

  async function getPincodeData(){
    if(addressInput.pincode && addressInput.pincode.length === 6){
      setPincodeDataLoading(true)
      try{
        let response = await axios.get(`${process.env.REACT_APP_GET_PINCODE_DATA}/${addressInput.pincode}`);
        let state=response.data[0].PostOffice[0].State
        let district=response.data[0].PostOffice[0].District
        setAddAddressInput({...addressInput,state:state,city:district})
      }
      catch(e){
        console.error("Error Fetching data from Pincode.")
      }
      finally{
        setPincodeDataLoading(false)
      }
    }
    
  }

  const validateForm = () => {  
    let newErrors = {};
    const regexEmail = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    const regexMobile = /^[0-9]{10}$/;
    const regexPincode = /^[0-9]{6}$/;
    const regexFullName = /^[A-Za-z\s]+$/;

    // FullName Condition
    if (!addressInput.fullName){
      newErrors.fullName = "Full Name is required.";
    }
    else if(!regexFullName.test(addressInput.fullName)){
      newErrors.fullName = "Full Name should only contain alphabets and spaces.";
    } 

    // Email Condition
    if (!addressInput.email || !regexEmail.test(addressInput.email)){
      newErrors.email = "Valid Email is required.";
    }

    // Mobile No. Condition
    if (!addressInput.mobileNo || !regexMobile.test(addressInput.mobileNo)){
      newErrors.mobileNo = "Valid Mobile No. is required.";
    } 

    // Address Condition
    if (!addressInput.address){
      newErrors.address = "Address is required.";
    } 

    // Locality Condition
    if (!addressInput.locality){
      newErrors.locality = "Locality/Town is required.";
    }else if(!regexFullName.test(addressInput.locality)){
      newErrors.locality = "Invalid Locality";
    }

    // Pincode Condition
    if (!addressInput.pincode || !regexPincode.test(addressInput.pincode)){
      newErrors.pincode = "Valid Pincode is required.";
    } 

    // City Condition
    if (!addressInput.city){
      newErrors.city = "City/District is required.";
    } 
    else if (!regexFullName.test(addressInput.city)){
      newErrors.city = "Invalid City/District"; 
    }

    // State Condition
    if (!addressInput.state){
      newErrors.state = "State is required.";
    } 
    else if (!regexFullName.test(addressInput.state)){
      newErrors.state = "Invalid State";
    }   
    console.log("nnn")
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  async function handleSave(){

    if(!validateForm()){
      showToast(LABELS.invalidForm,"error")
      return;
    }

    try{
      if(addressInput.userAddressId){
        let response =await axios.put("http://localhost:8080/user-address/update-address", JSON.stringify(addressInput), {
          headers: {
            'Accept': "application/json",
            "Content-Type": "application/json"
          }
        });
        editInAddressState(response.data.body)
        showToast("Address Updated","success")
      }
      else{
        let response=await axios.post("http://localhost:8080/user-address/add-address", JSON.stringify(addressInput), {
          headers: {
            'Accept': "application/json",
            "Content-Type": "application/json"
          }
          
        });
        addInAddressState(response.data.body);
        showToast("Address Saved","success")
      }
      closeAddAddressPop();
      }
    catch(error){
      showToast("Something Went Wrong","error")
      console.error(error);
      }
  }

  return (
      <div className='add-address-overlay'>
        <div className='add-address-container'>
          <div className='address-container-heading'>
            <p style={{fontSize:"20px",margin:"0px"}}>Add New Address</p>
            <CloseIcon className="add-address-close-icon" onClick={closeAddAddressPop}/>
          </div>

          <div className='row mt-2'>
            <div className='col'>
              <UserAddressInput maxLength={40} name="fullName" value={addressInput.fullName} onChange={handleInputChange} label="Full Name" placeholder={"Full Name"} isRequired={true}/>
              {errors.fullName && <InputErrorMessage errorMessage={errors.fullName}/>}
            </div>
          </div>

          <div className='row mt-3'>
            <div className='col'>
              <UserAddressInput maxLength={40} name="email" value={addressInput.email} onChange={handleInputChange} label="Email" placeholder={"Email"} isRequired={true}/>
              {errors.email && <InputErrorMessage errorMessage={errors.email}/>}
            </div>
          </div>

          <div className='row mt-3'>
            <div className='col'>
              <UserAddressInput name="mobileNo" maxLength={10} value={addressInput.mobileNo} onChange={handleInputChange} label="Mobile No." placeholder={"Mobile No."} isRequired={true}/>
              {errors.mobileNo && <InputErrorMessage errorMessage={errors.mobileNo}/>}
            </div>
          </div>

          <div className='row mt-3'>
            <div className='col'>
              <UserAddressInput name="address" maxLength={100} value={addressInput.address} onChange={handleInputChange} label="Address(House No. Building, Street Area)" placeholder={"Address(House No. Building, Street Area)"} isRequired={true}/>
              {errors.address && <InputErrorMessage errorMessage={errors.address}/>}
            </div>
          </div>
          
          <div className='row mt-3'>
            <div className='col-6'>
              <UserAddressInput name="locality" maxLength={20} value={addressInput.locality} onChange={handleInputChange} label="Locality/Town" placeholder={"Locality/Town"}/>
              {errors.locality && <InputErrorMessage errorMessage={errors.locality}/>}
            </div>
            <div className='col-6'>
              <UserAddressInput name="pincode" maxLength={6} value={addressInput.pincode} onChange={handleInputChange} onBlur={getPincodeData} label="Pincode" isRequired={true} placeholder={"Pincode"}/>
              {errors.pincode && <InputErrorMessage errorMessage={errors.pincode}/>}
            </div>
          </div>


          <div className='row mt-3'>
            <div className='col-6 pincode-data-loading-div'>
              <UserAddressInput disabled={pincodeDataLoading} maxLength={30}  name="city" value={addressInput.city} onChange={handleInputChange} label="City/District" isRequired={true} placeholder={"City/District"}/>
              {errors.city && <InputErrorMessage errorMessage={errors.city}/>}
            </div>
            <div className='col-6 pincode-data-loading-div'>
              <UserAddressInput disabled={pincodeDataLoading} maxLength={30} name="state" value={addressInput.state} onChange={handleInputChange} label="State" isRequired={true} placeholder={"State"}/>
              {errors.state && <InputErrorMessage errorMessage={errors.state}/>}
            </div>
          </div>

          <hr></hr>

          <div className='row'>
            <div className='col d-flex align-items-center'>
              <input type='checkbox' checked={addressInput.isDefault} name='isDefault' className='default-input-check me-1' onChange={handleCheckBoxChange}></input><label>Make this default address</label>
            </div>
          </div>

          <div className='row'>
            <div className='col'>
              <button className='save-address-btn mt-3' onClick={handleSave}>Save Address</button>
            </div>
          </div>
      </div>
      </div>
  )
}

export default AddAddressPopUp