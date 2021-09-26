import React from 'react';

import { useSelector, useDispatch } from 'react-redux';

import Rooms from '../Rooms';
import ImprovisedProfilePic from "../ImprovisedProfilePic"

import "./styles.css"

export default function Sidebar(){

  const profile = useSelector(state => state.profile);

  const dispatch = useDispatch();

  function openWindow(){
    dispatch({type: "SET_WINDOW", data: {open:true, app_options: true,}})
  }

  return(
    <div className="sidebar">
      <div className="profile"  onClick={() => openWindow()}>
        {profile.profile_img !== "" ?
          <img
          className="profile-image" 
          src={`http://${profile.profile_img}`}
          width="65"
          height="65"
          alt='teste, me deixa em paz n quero colocar detalhes'
          />
        :
          <ImprovisedProfilePic circle={false} user={profile} width={70} height={70}/>
        }
        <div className="user-data"> 
          <div className="name">{profile.name}</div>
          <div className="email">{profile.email}</div>
        </div>
      </div>
      <Rooms/>
    </div>
  )
}

//
