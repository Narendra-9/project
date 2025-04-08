import React, { useContext } from 'react'
import "./HeadingWithBullet.css"
import { ThemeContext } from '../../context/ThemeContext'
function HeadingWithBullet(props) {
  const {isPremium}=useContext(ThemeContext)
  return (
    <div className="content-heading">
            <div className={isPremium?"side-bullet-point-premium mb-2 me-2":"side-bullet-point mb-2 me-2"}></div>
            <h1>{props.heading}</h1>
    </div>
  )
}

export default HeadingWithBullet