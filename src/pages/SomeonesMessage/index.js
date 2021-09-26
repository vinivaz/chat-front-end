import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import {IoEllipsisVertical, IoEllipsisVerticalSharp } from "react-icons/io5";

import MessageReference from '../MessageReference';
import Popup from "../Popup"

import "./styles.css";

export default function MyMessage(props){
  const [ message, setMessage ] = useState(props.message);
  const profileId = useSelector(state => state.profile._id);
  const dispatch = useDispatch();


  function showImgMsg(url){
    console.log("someOnesmessage, show imgmsg")
    dispatch({type: "SET_WINDOW", data: {open: true, url: url}})
  }

  return(
    <div id={message.id} className="msg-box">
      <div className="them">
        {message.deletedTo === undefined?
          <>

            {message.respondedTo !== undefined ? 
              <div className="msg-details">
                <MessageReference messageId={message.respondedTo} />
                {message.url !== undefined?
                  <img 
                  src={'http://'+ message.url}
                  alt="message img"
                  onClick={() => showImgMsg(message.url)}
                  />
                :
                  <span>{message.text}</span>
                }
               </div>
            :
              <>
                {message.url !== undefined?
                  <img 
                  src={'http://'+ message.url}
                  alt="message img"
                  onClick={() => showImgMsg(message.url)}
                  />
                  :
                  <span>{message.text}</span>
                }
              </>
            }
            
          </> :
          <span>this message was deleted to you</span>
        } 
         <Popup
          solveInWindowOptions={["delete to me"]}
          solveInPopUpOptions={["answer"]}
          id={message._id}
          on={<IoEllipsisVerticalSharp/>}
            off={<IoEllipsisVertical/>}
        />
      </div>
    </div>
  )
}