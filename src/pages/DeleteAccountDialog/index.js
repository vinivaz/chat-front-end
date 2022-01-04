import React, { useState, useEffect } from 'react';
import { useHistory } from "react-router-dom";
import { useSelector, useDispatch } from 'react-redux';
import { logout} from '../../services/auth';

import { api } from '../../services/api';

import Loading from '../Loading';

import Loading2 from '../Loading2';

export default function DeleteAccountDialog(props){

  const [deleteAccount, setDeleteAccount] = useState(false)

  const [ isLoading, setIsLoading ] = useState(false)

  const [ infoUp, setInfoUp ] = useState(false)

  const [ info, setInfo ] = useState()

  const [ error, setError ] = useState()

  const [password, setPassword] = useState('')

  const history = useHistory()

  const dispatch = useDispatch()

  function close(){
    console.log("userOptions, close()")
    setPassword('')
    dispatch({type: "UNSET_WINDOW"})
    setDeleteAccount(false)
  }

  function handleLogout(){
    logout()
    dispatch({type: 'SET_INITIAL'})
    history.push('/')
  }

  function handleDeleteAccount(){
    if(!password) return;
    setIsLoading(true)
    api.post('/user/profile/deleteAccount', {password})
    .then(response => {
      setIsLoading(false)
      if(response.data.error){
        
        addError(response.data.error)
      }else{
        setPassword('')
        handleLogout()
      } 
    })
  }

  useEffect(() => {
    if (props.show=== true) {

      setDeleteAccount(props.deleteAccount)
      
    } else{
      close()
      
    }
  },[props.show])

  useEffect(() => {
    
    if(isLoading === true){
      setInfoUp(true)
    }else{
      setInfoUp(false)
    }
  },[isLoading])

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

  return(
        <div className="dialog-container">
          {infoUp&&
          <div className="info">
            <div
              className="info-content"
              style={{display: infoUp === true? 'block': 'none'}}
            >
              {error&&error}
              {info&&info}
              {isLoading=== true? <Loading2/> : ""}
            </div>
          </div>
        }
          <span>Delete account</span>
          <span className="dialog">After you confirm, this action has no way to be undone, all of the records,
            pictures shared and all conversations is going to be deleted, and your account will no longer exist,
             are you sure you want continue?</span>

          <input type="password" onChange={(e) => setPassword(e.target.value)} value={password} placeholder="Insert your password"/>
          <div className="buttons">
            <button 
              onClick={()=> {
                
                handleDeleteAccount()
              }}
            >
              Confirm
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
  )
}