import React from 'react'
import {ReactComponent as ErrorIcon} from "../../assets/error.svg"
function InputErrorMessage(props) {
  return (
    <p style={{margin:"0px",color:"red",marginTop:"15px",fontSize:"14px",display:"flex",alignItems:"center"}}><ErrorIcon className="error-icon me-1" width="13px" height="13px"/><span>{props.errorMessage}</span></p>
  )
}

export default InputErrorMessage