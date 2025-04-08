import { Avatar } from "@mui/material";
import React, { useState } from "react";
import "./UserDetailsDisplayInHeader.css"
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import UserOptions from "../UserOptions/UserOptions";

function UserDetailsDisplayInHeader({user}) {
    let [displayUserOptions, setDisplayUserOptions] = useState(false);


    function toggleOptions(e){
        setDisplayUserOptions(prev=>!prev);
    }


  return (
    <div className="admin-deatils-box" onClick={toggleOptions}>
      <div className="admin-profile-img">
        <Avatar className={ (user?.premiumActive) ? "user-display-avatar-premium":"user-display-avatar"}>{user?.userEmail?.slice(0,1).toUpperCase()}</Avatar>
      </div>
      <div className="admin-name-details">
        <p className="admin-name">{(user.userName?user?.userName:"User").slice(0,20)}{user?.userName?.length>20?"...":""}</p>
        <p className="admin-email">{user?.userEmail}</p>
      </div>
      
      
      {!displayUserOptions?<KeyboardArrowDownIcon className="mt-2"/>:<KeyboardArrowUpIcon className="mt-2"/>}
      {displayUserOptions&&<UserOptions toggleOptions={toggleOptions}/>}

      
    </div>
  );
}

export default UserDetailsDisplayInHeader;
