
import React, { useState, useEffect, useRef, memo } from 'react';

import { useDispatch } from 'react-redux';

import './styles.css';

function Popup(props){
  const [ isShown, setIsShown ] = useState(false);
  const dispatch = useDispatch()
  const ref = useRef(null);
  
  function openModal(item, messageData){
    dispatch({type: "SET_WINDOW", data: {open:true, message_action: item, message_data: messageData, app_options: false,}})
    setIsShown(!isShown)
    /*Object.keys(tools).map(key => {
      if(key === item){
        tools[key](id)
        console.log(key)
      }
    })*/
  }

  function answerMessage(messageId){
    dispatch({type: 'SET_ANSWER_MESSAGE', data: {active: true, message_id: messageId}})
    setIsShown(!isShown)
  }


  const handleHideDropdown = (event) => {
    if (event.key === "Escape") {
      document.removeEventListener("keydown", handleHideDropdown, true);
      document.removeEventListener("click", handleClickOutside, true);
      setIsShown(false)
    }
  };

  const handleClickOutside = event => {
    if (ref.current && !ref.current.contains(event.target)) {
      document.removeEventListener("keydown", handleHideDropdown, true);
      document.removeEventListener("click", handleClickOutside, true);
      setIsShown(false)
    }
  };

  function hasOptions(props){
    if(!(props.solveInWindowOptions)||!(props.solveInPopUpOptions)){
      dispatch({type: "SET_WINDOW", data: {open:true,  room_data: props.roomData, app_options: false, /*user_id: props.userId*/}})
    }else{
      setIsShown(!isShown)
    }
  }

  useEffect(() => {
    document.addEventListener("keydown", handleHideDropdown, true);
    document.addEventListener("click", handleClickOutside, true);
    return () => {
      document.removeEventListener("keydown", handleHideDropdown, true);
      document.removeEventListener("click", handleClickOutside, true);
    };
  });
  useEffect(() =>{
    setIsShown(props.shown)
  }, [props])

  
  return(
    <div className="options" ref={ref}>
      <div className="popup-icon" onClick={() => hasOptions(props)}>
        {isShown?props.on:props.off}
      </div>
      <div className={isShown ? "popup-show": "popup-hidden"}>
          {props.solveInWindowOptions&&props.solveInWindowOptions.map(item => (
            <div className="options-item" key={item} onClick={() => openModal(item, props.messageData,)}>{item}</div>
          ))}
          {props.solveInPopUpOptions&&props.solveInPopUpOptions.map(item => (
            <div className="options-item" key={item} onClick={() => answerMessage(props.messageData._id)}>{item}</div>
          ))}
          <div className="options-item" onClick={() => setIsShown(!isShown)}>cancel</div>
      </div>
      
    </div>
  )
}

export default memo(Popup)
/*
  {Object.keys(props).map(key =>(
          <div>{props.item[key]}</div>
        ))}
*/