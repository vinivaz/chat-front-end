
import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';

import { api } from '../../services/api';
import { removeRoom} from '../../services/socket'


//import "./styles.css";
export default function RoomOptions(props){

  const profile = useSelector(state => state.profile)

  const [confirmWindow, setconfirmWindow] = useState(false)

  const [roomId, setRoomId] = useState()

  const dispatch = useDispatch()

  function close(){
    
    dispatch({type: "UNSET_WINDOW"})
    setRoomId(undefined)
    setconfirmWindow(false)
  }

  function deleteChatHistory(roomId){

    api.delete(`/user/rooms/${roomId}`)
    .then()
    const otherUser = props.roomData.users.filter(user => user !== profile._id)
    
    removeRoom(props.roomData, otherUser)
  }

  function handleOpenProfile(roomData){
    
    const otherProfile = roomData.users.filter(user => user._id !== profile._id);

    if(otherProfile.length < 2){
      dispatch({type:'SET_PROFILE_SECTION', data: otherProfile[0]})
      close()
    }
  }

  useEffect(() => {
    if (props.show=== true) {
      
      setRoomId(props.roomData._id)
    } else{
      close()
    }
  },[props.show])

  return(
    <>
      {confirmWindow === false? 
        <div className="dialog-container">
          <div
            className="window-options"
            onClick={() => handleOpenProfile(props.roomData)}
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
        <div className="dialog-container">
          <span className="dialog">Delete all messages with this user?</span>
          <div className="buttons">
            <button 
              onClick={()=> {
                deleteChatHistory(roomId) 
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