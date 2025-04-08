import React, { useContext, useState } from 'react'
import UserProfileInput from '../UserProfileInput/UserProfileInput'
import { UserConext } from '../../context/UserContext';
import axios from 'axios';
import InputErrorMessage from '../InputErrorMessage/InputErrorMessage';

function UserEditComponent() {
    const {user,setUserData}=useContext(UserConext)
    let [canEdit,setCanEdit]=useState(false);
    let [userEditedDetails,setUserEditedDetails]=useState({
        userId:user?.userId,
        userName:user?.userName?user?.userName:"User",
        userEmail:user?.userEmail,
        gender:user?.gender?user.gender:"",
        phoneNumber:user?.phoneNumber?user.phoneNumber:""
      })
    const [errors, setErrors] = useState({});
    function validate() {
        const newErrors = {};
        if (!userEditedDetails.userName) {
          newErrors.userName = "Full Name is required";
        }
        if (!userEditedDetails.userEmail) {
          newErrors.userEmail = "Email is required";
        } else if (!/\S+@\S+\.\S+/.test(userEditedDetails.userEmail)) {
          newErrors.userEmail = "Email address is invalid";
        }
        if (!userEditedDetails.phoneNumber || !/^\d{10}$/.test(userEditedDetails.phoneNumber)) {
          newErrors.phoneNumber = "Phone Number must be 10 digits";
        }
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
      }
    
      function handleInputChange(e){
        if (e.target.name === "phoneNumber" && e.target.value.length > 10) {
          return;
        }
        setUserEditedDetails({...userEditedDetails,[e.target.name]:e.target.value})
      }
      function handleCanEdit(){
        setCanEdit(true);
      }
    
    
      async function handleSave(){
        if(!validate()){
          return
        }
        let response=await axios.put(`http://localhost:8080/users/edit-user`,JSON.stringify(userEditedDetails), {
          headers: {
            'Accept': "application/json",
            "Content-Type": "application/json"
          }
        })
        setUserData(response.data.body);
        setCanEdit(false);
    
      }
      function discard(){
        setCanEdit(false);
        setErrors({})
      }

  return (
    <div className='user-myprofile-container mt-5'>
          <div className='row'>
              <div className='col'><h2>Hi {userEditedDetails.userName}</h2></div>
              {!canEdit&&<div className='col d-flex justify-content-end'><button className='user-profile-edit-btn' onClick={handleCanEdit}>Edit</button></div>}
          </div>
          <div className='row mt-3 non-editable-details'>
              <div className='col-lg-6 mb-3'>
              <UserProfileInput label="Full Name" name="userName" value={!canEdit?(user?.userName?user.userName:"User"):userEditedDetails.userName} disabled={!canEdit} onChange={handleInputChange}/>
              {errors.userName && <InputErrorMessage errorMessage={errors.userName}/>}
              </div>
              <div className='col-lg-6 mb-3'>
              <UserProfileInput label="Email" name="userEmail" value={!canEdit?(user?.userEmail):userEditedDetails.userEmail} disabled={true} onChange={handleInputChange}/>
              {errors.userEmail && <InputErrorMessage errorMessage={errors.userEmail}/>}
              </div>
              <div className='col-lg-6 mb-3'>
              <UserProfileInput label="Gender" name="gender" value={userEditedDetails.gender} disabled={!canEdit} onChange={handleInputChange}/>
              </div>
              <div className='col-lg-6 mb-3'>
              <UserProfileInput label="Phone Number" name="phoneNumber" value={userEditedDetails.phoneNumber} disabled={!canEdit} onChange={handleInputChange}/>
              {errors.phoneNumber && <InputErrorMessage errorMessage={errors.phoneNumber}/>}
              </div>
          </div>
          {canEdit&&
            <div className='row mt-4'>
              <div className='col-lg d-flex justify-content-end'>
                  <button className='discard-btn' onClick={discard}>Discard</button>
                  <button className='save-btn' onClick={handleSave}>Save</button>
              </div>
          </div>
          }
        </div>
  )
}

export default UserEditComponent