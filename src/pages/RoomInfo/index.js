import React, { useState, useLayoutEffect, memo } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import {IoEllipsisVerticalSharp, IoEllipsisVertical } from "react-icons/io5";

import { api } from '../../services/api'
import Popup from "../Popup"
import ImprovisedProfilePic from "../ImprovisedProfilePic"
import './styles.css'

function RoomInfo(props){
  const [user, setUser] = useState({})
  const [picture, setPicture] = useState('')
  const [lastMessage, setLastMessage] = useState('');

  const profile = useSelector(state => state.profile);

  const dispatch = useDispatch();

  useLayoutEffect(() =>{
    
    checkUser(props)
    getLastMessage(props)
    //getPage()
  },[props]);


  function checkUser(props){
    //console.log(props, 'props')
    const you = props.users.filter(props => props !== profile._id)
    if(you.length > 0){

      api.get(`/user/profile/find/${you}`)
      .then(function(response) {
        setPicture(response.data.profile_img)
        setUser(response.data)
      })
      .catch(function (error){
        checkUser(props)
        console.log(error);
      })
    }
  }


  function getLastMessage(props){
    api.get(`/messages/lastmessage/${props.roomId}`)
    .then(function(response) {
      if(response.data[0].text){
        const lastMsg = response.data[0].text;
        if(lastMsg.length > 30){
          setLastMessage(lastMsg.slice(0, -(lastMsg.length - 30)) + "...")
        } else {
          setLastMessage(lastMsg)
        }
        //setLastMessage(response.data[0].text)
      }else{
        setLastMessage("*Picture*")
      }
    })
    .catch(function (error){
      console.log(error);
    })
  }

  function goToRoom(room){

    const chatRoom = {
      room_id: room
    }
    
    dispatch({type: 'SET_ROOM', data: chatRoom})
  }

  
  
  return(
    <div  className="room-info">
      <div className="room-seila" onClick={()=>goToRoom(props.roomId)}>
        {picture !== "" ?
          <img
          src={picture&&'http://' + picture}
          width="50"
          height="50"
          alt="Profile"
          />
        :
          <ImprovisedProfilePic user={user} width={50} height={50} circle={true}/>
        }
        <div className="room-data">
          <div className="user-name">{user&&user.name}</div>
          <div className="last-message">{lastMessage&&lastMessage}</div>
        </div>
      </div>
      <div className="sidebar-options">
        <div className="settlement">
          <Popup 
            userId={user._id}
            roomId={props.roomId}
            on={<IoEllipsisVertical/>}
            off={<IoEllipsisVertical/>}
          />
        </div>
      </div>
    </div>
  )
}

export default memo(RoomInfo)