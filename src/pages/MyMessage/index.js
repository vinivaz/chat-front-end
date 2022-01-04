import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { IoEllipsisVertical , IoMenuOutline} from "react-icons/io5";

import MessagePreview from '../MessageReference';
import Popup from "../Popup"
import useLongPress from "../../components/useLongPress"

import "./styles.css";
import MessageReference from '../MessageReference';

export default function MyMessage(props){
  const [ message, setMessage ] = useState(props.message);
  const [ isOptShown, setisOptShown ] = useState(false);
  const profileId = useSelector(state => state.profile._id);
  const dispatch = useDispatch();


  function showImgMsg(url){
    console.log("MyMessafe")
    dispatch({type: "SET_WINDOW", data: {open: true, url: `http://${message.url}`}})
  }

  const onLongPress = () => {
    console.log('longpress is triggered');
    setisOptShown(true)
  };

  const onClick = () => {
    console.log('click is triggered')
    if(message.url !== undefined){
      dispatch({type: "SET_WINDOW", data: {open: true, url: `http://${message.url}`}})
    }
  }
  
  const defaultOptions = {
    shouldPreventDefault: true,
    delay: 400,
  };

  const longPressEvent = useLongPress(onLongPress, onClick, defaultOptions);

  return(
    <div
      id={message._id}
      className="msg-box"
      style={{display: props.deleted === true ? 'none' : 'initial' }}
    >
      <div
        className="me"
        //onDoubleClick={() =>setisOptShown(true)}
        
      >
        {message.respondedTo !== undefined ? 
          <div className="msg-details">
            <MessageReference messageId={message.respondedTo} />
            <div className="bound"></div>
            {message.url !== undefined?
              <img 
              src={'http://'+ message.url}
              alt="message img"
              {...longPressEvent}
              />
            :
              <span {...longPressEvent}>{message.text}</span>
            }
          </div>
        :
          <>
          {message.url !== undefined?
            <img 
            src={'http://'+ message.url}
            alt="message img"
            //onClick={() => showImgMsg(message.url)}
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
        
        <Popup 
          solveInWindowOptions={["delete"]}
          solveInPopUpOptions={["answer"]}
          onDoubleClick={()=> setisOptShown(!isOptShown)}
          shown={isOptShown?true:false}
          id={message._id}
          messageData={props.message}
          on={<IoEllipsisVertical/>}
          off={<IoEllipsisVertical/>}
        />
      </div>
    </div>
  )
}