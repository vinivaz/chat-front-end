import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import {IoEllipsisVertical, IoEllipsisVerticalSharp } from "react-icons/io5";

import MessageReference from '../MessageReference';
import useLongPress from "../../components/useLongPress"
import Popup from "../Popup"

import "./styles.css";

export default function MyMessage(props){
  const [ message ] = useState(props.message);
  
  const dispatch = useDispatch();
  const [ isOptShown, setisOptShown ] = useState(false);


  const onLongPress = () => {
    setisOptShown(true)
  };

  const onClick = () => {
    if(message.url !== undefined){
      dispatch({type: "SET_WINDOW", data: {open: true, url: message.url}})
    }
  }
  
  const defaultOptions = {
    shouldPreventDefault: true,
    delay: 400,
  };

  const longPressEvent = useLongPress(onLongPress, onClick, defaultOptions);

  return(
    <div
      id={message.id}
      className="msg-box"
      style={{display: props.deleted === true ? 'none' : 'initial' }}
    >
      <div className="them">
        {message.deletedTo === undefined?
          <>

            {message.respondedTo !== undefined ? 
              <div className="msg-details">
                <MessageReference messageId={message.respondedTo} />
                <div className="bound"></div>
                {message.url !== undefined?
                  <img 
                  // src={'http://'+ message.url}
                  src={message.url}
                  alt="message img"
                  {...longPressEvent}
                  />
                :
                  <span
                    {...longPressEvent}
                  >
                    {message.text}
                  </span>
                }
               </div>
            :
              <>
                {message.url !== undefined?
                  <img 
                  // src={'http://'+ message.url}
                  src={message.url}
                  alt="message img"
                  {...longPressEvent}
                  />
                  :
                  <span
                    {...longPressEvent}
                  >
                    {message.text}
                  </span>
                }
              </>
            }
            
          </> :
          <span>you chose not to see this message</span>
        }
        {message.deletedTo === undefined ?
          <Popup
            solveInWindowOptions={["delete to me"]}
            solveInPopUpOptions={["reply"]}
            shown={isOptShown?true:false}
            id={message._id}
            messageData={props.message}
            on={<IoEllipsisVerticalSharp/>}
            off={<IoEllipsisVertical/>}
          />
          :
          ''
        }
         
      </div>
    </div>
  )
}