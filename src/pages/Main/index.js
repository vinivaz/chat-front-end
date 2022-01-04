import React, { useLayoutEffect, useEffect, useState } from "react"
import { useHistory } from "react-router-dom";
import { useDispatch, useSelector } from 'react-redux';

import { isAuthenticated } from '../../services/auth';
import { logout} from '../../services/auth';
import Sidebar from '../Sidebar';
import ChatRoom from '../ChatRoom';
import Profile from '../Profile';
import EditProfile from '../EditProfile';
import Users from '../Users';
import Window from '../Window';
import { api } from '../../services/api';
import './styles.css';

export default function Main(){

  const currentContent = useSelector(state => state.current_content);

  const history = useHistory()
  const dispatch = useDispatch();

  useLayoutEffect(() => {
    if(!isAuthenticated()){
      history.push('/')
      dispatch({type: 'SET_INITIAL'})
    }
  }) 

  useLayoutEffect(() => {
    getProfile()
  }, [])

  function getProfile(){
    api.get('/user/profile/find')
    .then((response) => {
      console.log(response)
      if(response.data.error=== "Invalid token"){
        dispatch({type: 'SET_INITIAL'})
        logout()
        history.push('/')
      }
      dispatch({type: 'SET_PROFILE', data: response.data})
      })
    .catch(function (error){
      console.log(error);
      dispatch({type: 'SET_INITIAL'})
      logout()
      history.push('/')
    })
  }
  
  return(  
    <div className="main">
      <Sidebar/>
      {currentContent.profile === true ?
        <Profile/>
      :
        <ChatRoom/>
      }
      <Users/>
      <EditProfile/>
      <Window/>
    </div>
  )
}

