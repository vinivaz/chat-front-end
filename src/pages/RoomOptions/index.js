
import React, { useState, useEffect, useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';

import { api } from '../../services/api';

//import "./styles.css";
export default function RoomOptions(props){

  const [confirmWindow, setconfirmWindow] = useState(false)

  const [roomOptions, setRoomOptions] = useState()

  const dispatch = useDispatch()

  function close(){
    console.log("roomOptions, close()")
    dispatch({type: "UNSET_WINDOW"})
    setRoomOptions(undefined)
    setconfirmWindow(false)
  }

  function deleteChatHistory(roomId){
    console.log(roomId)
    api.delete(`/user/rooms/${roomId}`)
    .then(console.log('deu bom'))
  }

  useEffect(() => {
    if (props.show=== true) {
      console.log("roomOptions", props.roomId)
      setRoomOptions(props.roomId)
    } else{
      close()
    }
  },[props.show])

  return(
    <>
      {confirmWindow === false? 
        <div className="message-window">
          <div
            className="window-options"
            onClick={() => console.log(roomOptions)}
          >
            <span>Open profile</span>
          </div>
          <div
            className="window-options"
            onClick={() => setconfirmWindow(true)}
          >
            <span>Delete History</span>
          </div>
          <div
            className="window-options"
            onClick={() => close()}
          >
            <span>Cancel</span>
          </div>
        </div>
      :
        <div className="message-window">
          <span>Delete all messages with this user?</span>
          <div className="buttons">
            <button 
              onClick={()=> {
                deleteChatHistory(roomOptions) 
                close()
               }}
            >
              delete
            </button>
            <button onClick={() => close()}>cancel</button>
          </div>
        </div>
      }
    </>
  )
}

/*
{roomOptions&&<div className="message-window">
          <div
            className="window-options"
            onClick={() => console.log(roomOptions)}
          >
            <span>See profile</span>
          </div>
          <div
            className="window-options"
            onClick={() => setconfirmWindow(true)}
          >
            <span>Delete History</span>
          </div>
          <div
            className="window-options"
            onClick={() => close()}
          >
            <span>Cancel</span>
          </div>
        </div>}
        {confirmWindow&&<div className="message-window">
          <span id="close" onClick={() => close()} className="close">&times;</span>
          <span>Delete all conversations?</span>
          <div className="buttons">
            <button 
              onClick={()=> {
                deleteChatHistory(roomOptions) 
                close()
              }}
            >
              delete
            </button>
            <button onClick={() => close()}>cancel</button>
          </div>
        </div>}
*/