import React from 'react'
import BeatLoader from "react-spinners/BeatLoader";
import "./Loading.css"
function Loading() {
  return (
    <div className='loading-container'> 
        <BeatLoader color='#ff5640' className='mt-5' size="30px"/>
    </div>
  )
}

export default Loading