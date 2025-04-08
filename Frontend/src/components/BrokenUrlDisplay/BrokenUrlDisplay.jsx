import React from 'react'
import styles from  "./BrokenUrlDisplay.module.css"
import { useNavigate } from 'react-router-dom'

function BrokenUrlDisplay() {
    const navigate=useNavigate();
  return (
    <div className={styles.mainDiv}>
        <div>
            <img src='/broken_egg.png' alt='broken_egg' height="400px"></img>
        </div>
        <div className='text-align'>
            <h2 className='mb-3'>Uh-Oh! Something here is broken.</h2>
            <p className='mb-3'>The page you're looking for is either removed from this location <br></br> or the URL is wrong. Let's take you to a better place.</p>
            <button className={styles.button} onClick={()=>navigate("/")}>Go To Home page</button>
        </div>
    </div>
  )
}

export default BrokenUrlDisplay