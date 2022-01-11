
import React from 'react';
import { useDispatch } from 'react-redux';

import ImgHandler from '../ImgHandler';

import customImg from '../../assets/custom-img2.svg'

export default function ViewImage({url}){
  const dispatch = useDispatch()
  
  function close(){
    dispatch({type: "UNSET_WINDOW"})
  }

  return(
    <>
      {url&&<div className="view-image">
          <div className="close-set">
            <span onClick={() => close()} className="close">&times;</span>
          </div>
              <ImgHandler
                //src={'http://'+ message.url}
                src={url}
                alt="message img"  
              >
                <img 
                  src={customImg}
                  style={{filter: 'grayscale(70%)'}}
                />
              </ImgHandler>
          {/* <img src={url} /> */}
        </div>
      }
    </>
  )
}