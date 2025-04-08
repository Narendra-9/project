import React from "react";
import "./UserProfileInput.css"
function UserProfileInput(props) {
  return (
    <div className="user-profile-input-div">
      <label className="user-profile-label ms-1">{props.label}</label>
      <input type={props.type} value={props.value} disabled={props.disabled} name={props.name} className="user-profile-input" placeholder={props.placeholder} onChange={props.onChange}></input>
    </div>
  );
}

export default UserProfileInput;
