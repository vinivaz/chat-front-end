import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';

import ImprovisedProfilePic from "../ImprovisedProfilePic"
import AddCircleOutlineIcon from '@material-ui/icons/AddCircleOutline'

import Loading from "../Loading";

import Loading2 from "../Loading2";


import { api } from '../../services/api'

import "./styles.css";

export default function ProfileSettings(){

  const [changePassword, setChangePassword ] = useState({
    currentPassword: "",
    newPassword: "",
  });

  const [ enterAllowed, setEnterAllowed ] = useState(false)

  const [ show, setShow ] = useState(false)

  const [ isLoading, setIsLoading ] = useState(false)

  const [ infoUp, setInfoUp ] = useState(false)

  const [ info, setInfo ] = useState()

  const [ error, setError ] = useState()

  const dispatch = useDispatch()

  useEffect(() => {
    
    if(isLoading === true){
      setInfoUp(true)
    }else{
      setInfoUp(false)
    }
  },[isLoading])


  function changePass(){
    
    if((changePassword.currentPassword === "")||(changePassword.newPassword === "")){
      return;
    }

    if(infoUp ===true){
      return;
    }
    setIsLoading(true)
    api.post('/user/profile/changePasswordLoggedIn', {
      currentPassword: changePassword.currentPassword,
      newPassword: changePassword.newPassword
    })
    .then(response => {
      
      if(response.data.error){
        setIsLoading(false)
        addError(response.data.error)
      }else{
        setIsLoading(false)
        addInfo()
      }
      console.log(response)
    })
    .catch(function(error){
      setInfoUp(false)
      console.log(error)
    })
  }

  function addInfo(something){
    setInfo('Success')
    setInfoUp(true)
    setTimeout(
      () => {
        setInfoUp(false)
        setInfo('')
        setShow(false)
        setEnterAllowed(false)
      }
    ,2000)
  }

  function addError(something){
    setError(something)
    setInfoUp(true)
    setTimeout(
      () => {
        setInfoUp(false)
        setError('')
      }
    ,2000)
  }

  useEffect(() => {
    console.log(changePassword)

    if((changePassword.currentPassword === "")||(changePassword.newPassword === "")){
      setEnterAllowed(false)
    }else{
      setEnterAllowed(true)
    }
    
  },[changePassword])

  return(
    <div className="profile-settings">
        {infoUp&&
          <div className="info">
            <div
              className="info-content"
              style={{display: infoUp === true? 'block': 'none'}}
            >
              {error&&error}
              {info&&info}
              {isLoading=== true? <Loading2 size='large'/> : ""}
            </div>
          </div>
        }
        <div>Change password</div>
        <div className={`settings-item ${infoUp=== false? "": "loading"}`}>
          <span>Current password</span>
          <input
            type="password"
            onChange={(e) => {
              setChangePassword({...changePassword, currentPassword: e.target.value})
                        
            }}
            placeholder='Insert current password'
            autoComplete="off"
          />
        </div>
        <div className={`settings-item ${infoUp=== false? "": "loading"}`}>
          <span>New password</span>
          <input
            type="password"
            onChange={(e) => setChangePassword({...changePassword, newPassword: e.target.value})}
            placeholder='Insert new password'
            autoComplete="off"
          />
          <button
            className={enterAllowed===true? 'ok': 'waiting'}
            onClick={() => changePass()}
          >
            Enter
          </button>
        </div>
        <div className="other-settings">
          
          <div className="content">

            <span
              onClick={() => dispatch({
                type: 'SET_WINDOW',
                data: {
                  open: true,
                  delete_account: true
                }
              })}
            >Delete account</span>
          </div>
        </div>          
      </div>
  )
}

/*
  <hr/>
        <div className="settings-item">
          <span>Change e-mail</span>
          <input
            type="text"
            placeholder='Insert token'
            autoComplete="off"
          />

          <button className="ok">Send Token</button>
        </div>

*/

/* <>{show===true? 
      <div className="profile-settings">
        {infoUp&&
          <div className="info">
            <div
              className="info-content"
              style={{display: infoUp === true? 'block': 'none'}}
            >
              {error&&error}
              {info&&info}
              {isLoading=== true? <Loading2 size='large'/> : ""}
            </div>
          </div>
        }
        <div>Change password</div>
        <div className={`settings-item ${infoUp=== false? "": "loading"}`}>
          <span>Current password</span>
          <input
            type="password"
            onChange={(e) => {
              setChangePassword({...changePassword, currentPassword: e.target.value})
                        
            }}
            placeholder='Insert current password'
            autoComplete="off"
          />
        </div>
        <div className={`settings-item ${infoUp=== false? "": "loading"}`}>
          <span>New password</span>
          <input
            type="password"
            onChange={(e) => setChangePassword({...changePassword, newPassword: e.target.value})}
            placeholder='Insert new password'
            autoComplete="off"
          />
          <button
            className={enterAllowed===true? 'ok': 'waiting'}
            onClick={() => changePass()}
          >
            Enter
          </button>
        </div>
        <div className="other-settings">
          
          <div className="content">

            <span
              onClick={() => dispatch({
                type: 'SET_WINDOW',
                data: {
                  open: true,
                  delete_account: true
                }
              })}
            >Delete account</span>
          </div>
        </div>          
      </div>
    : 
      <div
        className="see-more"
        onClick={() => setShow(true)}
      >
        <AddCircleOutlineIcon style={{ fontSize: '10rem' }}/>
      </div>
      
      // <div
      //   className="profile-settings"
      //   onClick={() => setShow(true)}
      // >
      //   <div className="skeletton">
      //     <div className="skeletton-half-item"></div>
      //     <div className="skeletton-item"></div>
      //     <div className="skeletton-half-item"></div>
      //     <div className="skeletton-item"></div>
          
      //     <div className="skeletton-btn"></div>
      //   </div>
      // </div>
    }
    </> */