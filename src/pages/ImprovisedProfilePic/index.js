import React, { useEffect } from 'react';

import "./styles.css";
export default function ImprovisedProfilePic({user, width, height, circle}){
  

  var stringToColour = function(str) {
    var hash = 0;
    for (var i = 0; i < str.length; i++) {
        hash = str.charCodeAt(i) + ((hash << 5) - hash);
    }
    var colour = '#';
    for (var i = 0; i < 3; i++) {
        var value = (hash >> (i * 8)) & 0xFF;
        colour += ('00' + value.toString(16)).substr(-2);
    }
    return colour;
  }

  return(
    <div className="improvised-profile-pic">
      <div
      className="colored-icon"
      style={{
        backgroundColor: user._id === undefined?"#fff":stringToColour(user._id),
        borderRadius: circle ===true? 50 +"px": "3px",
        width: width !== undefined? width + "px": '',
        height: height !== undefined ? height + "px": '',
      }}
      >
      </div>
    </div> 
  )
}