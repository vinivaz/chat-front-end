
import React from 'react';
import { useDispatch } from 'react-redux';

export default function ViewImage({url}){
  const dispatch = useDispatch()
  
  function close(){
    console.log("viewImage, close()")
    dispatch({type: "UNSET_WINDOW"})
  }

  return(
    <>
      {url&&<div className="view-image">
          <div className="close-set">
            <span onClick={() => close()} className="close">&times;</span>
          </div>
          <img src={url} />
        </div>
      }
    </>
  )
}