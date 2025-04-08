import React from 'react'
import "./UserAddressInput.css"
function UserAddressInput(props) {
  return (
    <div className='user-address-input-container'>
        <label className='user-address-input-label'>{props.label}{props.isRequired?<span className='star ms-1'>*</span>:""}</label>
        <input className='user-address-input' min={props.min} max={props.max} minLength={props.minLength} maxLength={props.maxLength} type='text' disabled={props.disabled} placeholder={props.placeholder} value={props.value} onChange={props.onChange} onBlur={props.onBlur} name={props.name}></input>
    </div>
  )
}

export default UserAddressInput