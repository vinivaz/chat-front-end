import React, { useState, useLayoutEffect, useEffect } from "react"
import { Link, useHistory } from 'react-router-dom';
import { api } from '../../services/api';
import { login, isAuthenticated } from '../../services/auth';
import './styles.css';

import Loading from '../Loading';

const ForgotPassword = () => {

  const [data, setData] = useState({
    email: '',
    token: '',
    newPassword: '',
    confirmPassword: ''
  });

  //const [ tokenRequested, setTokenRequested ] = useState(false);

  const [ tokenSent, setTokenSent ] = useState(false);

  //const [ changePass, setChangePass ] = useState(false);

  const [ isLoading, setIsLoading ] = useState(false)

  const [ infoUp, setInfoUp ] = useState(false)

  const [ info, setInfo ] = useState()

  const [ error, setError ] = useState()

  const history = useHistory()

  useEffect(() => {
    
    if(isLoading === true){
      setInfoUp(true)
    }else{
      setInfoUp(false)
    }
  },[isLoading])

  function addInfo(something){
    setInfo('Success')
    setInfoUp(true)
    setTimeout(
      () => {
        setInfoUp(false)
        setInfo('')
        //setShow(false)
        //setEnterAllowed(false)
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

  useLayoutEffect(() => {
    if (isAuthenticated()) {
      history.push('/app');
    }
  })

  const requestToken = async (e)=> {
    e.preventDefault();
    if(isLoading)return;
    const { email } = data;
    if (!email) {
      addError("Insert a valid e-mail address")
    } else {
      setIsLoading(true)
      api.post('/user/forgot_password', { email })
      .then(response => {
        console.log(response)
        if(response.data.error){
          setIsLoading(false)
          setData({...data, email: ''})
          addError(response.data.error)
        }else{
          setData({...data, email: ''})
          setIsLoading(false)
          addInfo()
          setTokenSent(!tokenSent)
        }
      })
      .catch(function(error){
        console.log(error)
      })
    }
  }

  const changePassword = async (e)=> {
    e.preventDefault();
    setIsLoading(true)
    const { email, token, newPassword, confirmPassword } = data;
    if (!email||!token||!newPassword||!confirmPassword) {

      setIsLoading(false)
      addError("All fields are required")
      return;
    }

    if(newPassword !== confirmPassword){

      setIsLoading(false)
      addError('Password fields doesn\'t match')
      return;
    }
    
    api.post('/user/change_password', { email, password: newPassword, token })
      .then(response => {
        console.log(response)
        if(response.data.error){
          setIsLoading(false)
          addError(response.data.error)
        }else{
          setData({...data, error: '', email: '', token: '', newPassword: '', confirmPassword: ''})
          addInfo()
        }
      })
      .catch(function(error){
        console.log(error)
      })
  }

  return (
    <>
    {tokenSent === false? 
      <div className="forgot-password">
        
        <form className="form" onSubmit={(e) => requestToken(e)} >
        {infoUp&&
          <div className="info">
            <div
              className="info-content"
              style={{display: infoUp === true? 'block': 'none'}}
            >
              {error&&error}
              {info&&info}
              {isLoading=== true? <Loading/> : ""}
            </div>
          </div>
        }
          <h3 className="title">Reset password</h3>
          <p>Insert your e-mail address associated with your account, we'll send you a token in order to reset your password</p>
          <input 
            className="input"
            placeholder="E-mail"
            type='text'
            value={data.email}
            onChange={e => (setData({...data,  email: e.target.value, error: ''}))}
          />
          <button className="form-btn"  type="submit" >Request Token</button>
          
          <span onClick={() => setTokenSent(true)}> Already got a token?</span>
          <hr />
          <div className="form-navigation">
            <Link className="link-btn" to='/SignUp'>SignUp</Link>
            <Link className="link-btn" to='/'>SignIn</Link>
          </div>
        </form>
      </div>
    :
      <div className="forgot-password">
        <form className="form" onSubmit={(e) => changePassword(e)} >
          {infoUp&&
            <div className="info">
              <div
                className="info-content"
                style={{display: infoUp === true? 'block': 'none'}}
              >
                {error&&error}
                {info&&info}
                {isLoading=== true? <Loading/> : ""}
              </div>
            </div>
          }
          <h3 className="title">Reset password</h3>
          <input 
            className="input"
            placeholder="E-mail"
            type='text'
            value={data.email}
            onChange={e => (setData({...data, email: e.target.value}))}
          />
          <p>Check your e-mail box, copy the token that was sent in your email and place it in the token field</p>
          <input 
            className="input"
            placeholder="Insert Token"
            type='text'
            value={data.token}
            onChange={e => (setData({...data, token: e.target.value, error: ''}))}
          />
          <input 
            className="input"
            placeholder="New password"
            type='password'
            value={data.newPassword}
            onChange={e => (setData({...data, newPassword: e.target.value, error: ''}))}
          />
          <input 
            className="input"
            placeholder="Confirm password"
            type='password'
            value={data.confirmPassword}
            onChange={e => (setData({...data, confirmPassword: e.target.value, error: ''}))}
          />
          <button className="form-btn"  type="submit" >Entrar</button>
          <span
            onClick={() => setTokenSent(!tokenSent)}
          >
            Request token
          </span>
          <hr />
          <div className="form-navigation">
            <Link className="link-btn" to='/SignUp'>SignUp</Link>
            <Link className="link-btn" to='/'>SignIn</Link>
          </div>
        </form>
      </div>
    }
    </>
    
  )
}

export default ForgotPassword;