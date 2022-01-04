import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';

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