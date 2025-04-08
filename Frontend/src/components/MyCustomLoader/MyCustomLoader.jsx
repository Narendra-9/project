import React from 'react'
import './MyCustomLoader.css'

function MyCustomLoader(props) {
  return (
    <div className="loading-indicator">
        <div className="spinner"></div>
        <p>{props.text}...</p>
    </div>
  )
}

export default MyCustomLoader