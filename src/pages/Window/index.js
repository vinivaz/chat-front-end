
import React, { useState, useEffect, useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';

import AppOptions from '../AppOptions';

import MessageOptions from '../MessageOptions';

import RoomOptions from '../RoomOptions';

import ProfileOptions from '../ProfileOptions';

import UserOptions from '../UserOptions';

import ViewImage from '../ViewImage';

import "./styles.css";
import Profile from '../Profile';
export default function Window(){

  const [ isOpen, setIsOpen ] = useState()

  const [ url, setUrl ] = useState()

  const [ roomId, setRoomId ] = useState()

  const [ userId, setUserId ] = useState()

  const [ appOptions, setAppOptions ] = useState()

  const [ profileData, setProfileData ] = useState()

  const [ messageOptions, setMessageOptions ] = useState({})

  const window = useSelector(state => state.window)

  const dispatch = useDispatch()

  const ref = useRef(null)

  const handleHideDropdown = (event) => {
    if (event.key === "Escape") {
      document.removeEventListener("keydown", handleHideDropdown, true);
      document.removeEventListener("click", handleClickOutside, true);
      close()
    }
  };

  const handleClickOutside = event => {
    console.log("abubleh")
    if (ref.current && !ref.current.contains(event.target)) {
      document.removeEventListener("keydown", handleHideDropdown, true);
      document.removeEventListener("click", handleClickOutside, true);
      close()
    }
  };

/*
  function close(){
    console.log("window, close()")
    dispatch({type: "SET_IMAGE_WINDOW", data: {open:false, url:"", message_action: undefined, message_id: undefined, app_options:false,}})
  }
*/
  
  function close(){
    console.log("window, close()")
    dispatch({type: "UNSET_WINDOW"})
  }


  function loadContent(){
    
    setUrl(window.url)
    setMessageOptions({
      messageAction: window.message_action,
      messageId: window.message_id
    })
    setRoomId(window.room_id)
    setUserId(window.user_id)
    setProfileData(window.profile_data)
    setAppOptions(window.app_options)
  }

  useEffect(() =>{
    if(window.open === true){
      setIsOpen(true)
      loadContent()
      document.addEventListener("keydown", handleHideDropdown, true);
      document.addEventListener("click", handleClickOutside, true);
    }else{
      setIsOpen(false)
      document.removeEventListener("keydown", handleHideDropdown, true);
      document.removeEventListener("click", handleClickOutside, true);
    }
  
    
  }, [window])

  return(
    <div id="Awindow" style={{display:isOpen? "block": "none"}}  className="window">
      <div className="window-content" ref={ref}>
        {messageOptions&&
          <MessageOptions
            messageId={messageOptions.messageId}
            messageAction={messageOptions.messageAction}
            show={true}
          />
        }
        {roomId&&
          <RoomOptions
            roomId={roomId}
            show={isOpen? true : false}
          />
        }
        {url&&
          <ViewImage
            url={url}
          />
        }
        {userId&&
          <UserOptions
            userId={userId}
            show={true}
          />
        }
        {profileData&&
          <ProfileOptions
            profileData={profileData}
            show={isOpen? true : false}
          />
        }
        {appOptions&&
          <AppOptions
            appOptions={true}
            show={isOpen? true : false}
          />
        }
      </div> 
    </div>
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
            onClick={() => deleteChatHistory(roomOptions)}
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

 {messageAction&&<div className="message-window">
          <span id="close" onClick={() => close()} className="close">&times;</span>
          <span>{text}</span>
          <div className="buttons">
            <button 
              onClick={()=> {
                Tools[messageAction].finalAction(window.message_id) 
                close()
              }}
            >
              delete
            </button>
            <button onClick={() => close()}>cancel</button>
          </div>
        </div>}

        {url&&<div className="view-image">
          <div className="close-set">
            <span onClick={() => close()} className="close">&times;</span>
          </div>
          <img src={'http://' + url} />
        </div>}

*/