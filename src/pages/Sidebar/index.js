import React, { useEffect, useState, useRef } from 'react';

import { useSelector, useDispatch } from 'react-redux';

import Rooms from '../Rooms';
import ImprovisedProfilePic from "../ImprovisedProfilePic"

import KeyboardArrowLeftIcon from '@material-ui/icons/KeyboardArrowLeft'
import KeyboardArrowRightIcon from '@material-ui/icons/KeyboardArrowRight'
import ArrowRightIcon from '@material-ui/icons/ArrowRight'
import AccountCircleIcon from '@material-ui/icons/AccountCircle'
import MoreVertIcon from '@material-ui/icons/MoreVert'

import "./styles.css"

export default function Sidebar(){

  const profile = useSelector(state => state.profile);

  const [ profileImg, setProfileImg ] = useState()

  const sidebarExpanded = useSelector(state => state.navigation.expanded_sidebar);

  const sidebarShowing = useSelector(state => state.navigation.show_sidebar);

  const [ timer, setTimer ] = useState(null)

  const dispatch = useDispatch();

  const ref = useRef(null)

  useEffect(() =>{
    setProfileImg(profile.profile_img)
  },[profile])

  useEffect(() =>{
    if(sidebarExpanded === false){
      resetSidebarTimeout()
    }else if(timer !== null){
      clearTimeout(timer)
    }
    
  },[sidebarExpanded]);

  function getClass(){
    if(sidebarShowing === false) return 'hidden';
    if(sidebarExpanded === true){
      return 'expanded'
    }else{
      return 'shruken'
    }
  }

  function SetExpandIcon(){
    if(sidebarShowing === false && sidebarExpanded === true) return <ArrowRightIcon style={{ fontSize: '5rem' }}/>;
    if(sidebarExpanded === true){
      return <KeyboardArrowLeftIcon style={{ fontSize: '5rem' }}/>
    }else{
      return <ArrowRightIcon style={{ fontSize: '5rem' }}/>
    }
  }

  function sidebarTimeOut(){
    setTimer(setTimeout(
      () => {
        dispatch({type: "HIDE_SIDEBAR"})
      }, 5000))

  }

  function resetSidebarTimeout(){
    
    if(timer !== null){
      clearTimeout(timer)
      sidebarTimeOut()
    }else{
      sidebarTimeOut()
    }
    
  }

  const handleHideDropdown = (event) => {
    if (event.key === "Escape") {
      document.removeEventListener("keydown", handleHideDropdown, true);
      document.removeEventListener("click", handleClickOutside, true);
      dispatch({type: 'HIDE_SIDEBAR'})
      clearTimeout(timer)
    }
  };

  const handleClickOutside = event => {
    
    if (ref.current && !ref.current.contains(event.target)) {
      
      document.removeEventListener("keydown", handleHideDropdown, true);
      document.removeEventListener("click", handleClickOutside, true);
      dispatch({type: 'HIDE_SIDEBAR'})
      clearTimeout(timer)
    }
  };

  useEffect(() =>{
    if(sidebarShowing === true){
      document.addEventListener("keydown", handleHideDropdown, true);
      document.addEventListener("click", handleClickOutside, true);
    }else{
      
      document.removeEventListener("keydown", handleHideDropdown, true);
      document.removeEventListener("click", handleClickOutside, true);
    }
  
    
  }, [sidebarShowing])


  function openWindow(){
    dispatch({type: "SET_WINDOW", data: {open:true, app_options: true,}})
  }

  return(
    <div
      ref={ref}
      className={`sidebar ${getClass()}`}
    >
      <div
        className="profile sidebar-header"
      >
        {profileImg !== "" ?
          <img
            className="profile-image" 
            // src={`http://${profile.profile_img}`}
            src={profileImg}
            width="65"
            height="65"
            alt='teste, me deixa em paz n quero colocar detalhes'
            onError={() => setProfileImg("")}
          />
        :
          <ImprovisedProfilePic circle={false} user={profile} />
        }
        <div className="user-data sidebar-content">
          <div className="first-content">
            <div className="name">{profile.name}</div>
            <div className="sidebar-buttons">
              <div
                className="go-to-users"
                onClick={
                  () => {
                    dispatch({type: 'TOGGLE_USERS', data: true})
                    dispatch({type: "HIDE_SIDEBAR"})
                  }
                }
              >
                <AccountCircleIcon style={{ fontSize: '3rem' }}/>
              </div>
              <div
                className="sidebar-options"
                onClick={() => openWindow()}
              > 
                <MoreVertIcon style={{ fontSize: '3rem' }}/>
              </div>
            </div>
          </div>
          <div className="email">{profile.email}</div>
        </div> 
      </div>
      <div
        className="sidebar-toggle"
        onClick={sidebarExpanded===false?
          () => {
            dispatch({type: "EXPAND_SIDEBAR"})
            
          }
          :
          () => {
            
            dispatch({type: "HIDE_SIDEBAR"})
          }
        }

      >
        <div className="extend-icon">
          {/* <KeyboardArrowLeftIcon style={{ fontSize: '5rem' }}/> */}
          <SetExpandIcon/>
        </div>
      </div>
      <Rooms/>
    </div>
  )
}
