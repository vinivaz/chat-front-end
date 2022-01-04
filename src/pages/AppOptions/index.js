import React, { useState, useEffect } from 'react';
import { useHistory } from "react-router-dom";
import { useSelector, useDispatch } from 'react-redux';

import { logout} from '../../services/auth';

export default function AppOptions(props){

  const profile = useSelector(state => state.profile);

  const [confirmWindow, setconfirmWindow] = useState(false)

  const [appOpt, setAppOpt] = useState(false)

  const history = useHistory()

  const dispatch = useDispatch()

  function close(){
    dispatch({type: "UNSET_WINDOW"})
    setAppOpt(false)
  }

  function handleLogout(){
    logout()
    dispatch({type: 'SET_INITIAL'})
    history.push('/')
  }

  function openPicture(url){
    dispatch({type: 'SET_WINDOW', data: { open: true, url: `http://${url}`}})
  }

  function openProfile(){
    dispatch({type:'SET_PROFILE_SECTION', data: profile._id})
  }

  useEffect(() => {
    if (props.show=== true) {

      setAppOpt(props.appOptions)
      
    } else{
      close()
      setconfirmWindow(false)
    }
  },[props.show])

  return(
    <>
      {confirmWindow === false? 
        <div className="dialog-container">
          <div
            className="window-options"
            onClick={() => {
              close()
              openProfile()
            }}
          >
            <span>Open profile</span>
          </div>
          {profile.profile_img !== "" ?
            <div
            className="window-options"
            onClick={() => openPicture(profile.profile_img)}

            >
              <span>Open profile picture</span>
            </div>
            :
            ""
          }
          <div
            className="window-options"
            onClick={() => setconfirmWindow(true)}
          >
            <span>Logout</span>
          </div>
          <div
            className="window-options"
            onClick={()=>{
              close()
            }}
          >
            <span>Cancel</span>
          </div>
        </div>
      :
        <div className="dialog-container">
          
          <span className="dialog">Logout?</span>
          <div className="buttons">
            <button 
              onClick={()=> {
                close()
                handleLogout()
              }}
            >
              Logout
            </button>
            <button
              onClick={()=>{
                close()
              }}
            >
              Cancel
            </button>
          </div>
        </div>
      }
    </>
  )
}