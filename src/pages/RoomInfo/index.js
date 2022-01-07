import React, { useState, useEffect, useLayoutEffect, memo } from 'react';
import { useSelector, useDispatch } from 'react-redux';

import { IoEllipsisVertical } from "react-icons/io5";

import Popup from "../Popup"
import ImprovisedProfilePic from "../ImprovisedProfilePic"
import './styles.css'

function RoomInfo(props){
  const [user, setUser] = useState({});

  const [picture, setPicture] = useState('');

  const currentRoom = useSelector(state => state.room.room_id);

  const profile = useSelector(state => state.profile);

  const sidebarShowing = useSelector(state => state.navigation.show_sidebar);

  const onlineUsers = useSelector(state => state.online_users);

  const [ isOnline, setIsOnline ] = useState(false);

  const dispatch = useDispatch();

  useLayoutEffect(() =>{
    //console.log("roomInfo",props)
    checkUser(props)

    // getLastMessage(props.roomData)
    //getPage()
  },[props]);

  useEffect(() => {
    
    if(user._id && onlineUsers){
      if(onlineUsers.includes(user._id)){
        setIsOnline(true)
      }else{
        setIsOnline(false)
      }
      
    }
  
  },[onlineUsers, user._id])


  function checkUser(props){
    
    
    const you = props.users.filter(x => x._id !== profile._id)

    if(you.length > 0){
      setPicture(you[0].profile_img)
      setUser(you[0])
    }
  }

  function goToRoom(room){

    if(currentRoom === room._id){
      return;
    }else{

      const chatRoom = {
      room_id: room._id,
      room_data: room
      }

      if(sidebarShowing){
        dispatch({type: "HIDE_SIDEBAR"})
      }
      
      dispatch({type: 'SET_ROOM', data: chatRoom})
    }

  }

  return(
    <div className="room">
      <div className="room-features" onClick={()=>goToRoom(props.roomData)}>
        <div className="user-icon">
          {picture !== "" ?
            <img
            // src={picture&&'http://' + picture}
            src={picture}
            width="50"
            height="50"
            alt="Profile"
            onError={() => setPicture('')}
            />
          :
            <ImprovisedProfilePic user={user}  circle={true}/>
          }
          {isOnline === true ?
            <div className="online-sign"></div>
            :
            ''
          }
        </div>
        <div className="room-text">
          <div className="user-name">{user&&user.name}</div>
          <div className="last-message">{props&&props.roomData.lastMessage}</div>
        </div>
      </div>
      <div className="sidebar-options">
        <div className="settlement">
          <Popup 
            userId={user._id}
            roomData={props.roomData}
            on={<IoEllipsisVertical/>}
            off={<IoEllipsisVertical/>}
          />
        </div>
      </div>
    </div>
  )
}

export default memo(RoomInfo)