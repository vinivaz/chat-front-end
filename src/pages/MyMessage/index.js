import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { IoEllipsisVertical , IoMenuOutline} from "react-icons/io5";

import MessagePreview from '../MessageReference';
import Popup from "../Popup"

import "./styles.css";
import MessageReference from '../MessageReference';

export default function MyMessage(props){
  const [ message, setMessage ] = useState(props.message);
  const [ isOptShown, setisOptShown ] = useState(false);
  const profileId = useSelector(state => state.profile._id);
  const dispatch = useDispatch();


  function showImgMsg(url){
    console.log("MyMessafe")
    dispatch({type: "SET_WINDOW", data: {open: true, url: url}})
  }

  return(
    <div id={message._id} className="msg-box">
      <div className="me" onDoubleClick={() =>setisOptShown(true)}>
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
        
        <Popup 
          solveInWindowOptions={["delete"]}
          solveInPopUpOptions={["answer"]}
          onDoubleClick={()=> setisOptShown(!isOptShown)}
          shown={isOptShown?true:false}
          id={message._id}
          on={<IoEllipsisVertical/>}
          off={<IoEllipsisVertical/>}
        />
      </div>
    </div>
  )
}