import React from 'react';

import "./styles.css";

export default function TypingAnimation({size}){
  return(
    <div className="typing_animation">
      <div className="container">
        <span></span>
        <span></span>
        <span></span>
      </div>
      <div className="origin-indicator"></div>
    </div>
  )
}