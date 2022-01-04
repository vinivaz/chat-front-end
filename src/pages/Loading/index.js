import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';

import "./styles.css";

export default function Loading({size}){
  return(
    <div
      className="loading-animation"
      style={
        size==='large' ?
          {
            width: "40px",
            height: "40px"
          }
        :
          {
            width: "25px",
            height: "25px"
          }
      }
    >
      <div
        className="inner-circle"
        style={
          size==='large' ?
            {
              width: "20px",
              height: "20px",
              top: "25.4%",
              left: "25.4%"
            }
          :
            {
              width: "15px",
              height: "15px",
              top: "20%",
              left: "20%"
            }
        }
      >
      </div>
    </div>
  )
}