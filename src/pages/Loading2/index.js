import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';

import "./styles.css";

export default function Loading2({size}){
  return(
    <div className="loading-container">
      <div className="loader">
        <span></span>
        <div className="semicircle"></div>
        <div style={{transform: "rotate(180deg) scaleX(-1)"}} className="semicircle2"></div>
      </div>
    </div>
  )
}