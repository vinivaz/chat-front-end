import React, { useState, useLayoutEffect } from "react"
import { Link, useHistory } from 'react-router-dom';
import { api } from '../../services/api';
import { login, isAuthenticated } from '../../services/auth';
import './styles.css';

import logo from '../../assets/logo-bigger.svg'

const SignIn = () => {
  const [data, setData] = useState({
    email: '',
    password: '',
    error: ''
  });

  const history = useHistory()

  useLayoutEffect(() => {
    if (isAuthenticated()) {
      history.push('/app');
    }
  })

  const HandleSignIn = async (e)=> {
    e.preventDefault();
    const { email, password } = data;
    if (!email || !password) {
      setData({
        ...data,
        error: 'All field\'s required'
      })
    } else {
      const response = await api.post('/user/authenticate', { email, password });
      const error = response.data.error;
      if (error) {
        setData({...data, error })
      } else {
        const token = response.data.token;
        login(token);
        history.push('/app');
      }
    }
  }

  return (
    <div className="SignIn">
      {/* <div className="application-intro">
        <img src={logo} alt="logo"/>
        <span>Nexum</span>
      </div> */}
      <form className="form" onSubmit={(e) => HandleSignIn(e)} >
        <div className="application-intro">
          <img src={logo} alt="logo"/>
          <span>Nexum</span>
        </div>
        <div className="page-info"><span>Sign In</span></div>
        <input 
          className="input"
          placeholder="E-mail"
          type='text'
          onChange={e => (setData({...data,  email: e.target.value, error: ''}))}
        />
        <input 
          className="input"
          placeholder="Password"
          type='password'
          onChange={e => (setData({...data, password: e.target.value, error: ''}))}
        />
        <button className="form-btn"  type="submit" >Enter</button>
        
        {data.error && <p className="alerti">{data.error}</p>}
        <hr />
        <div className="form-navigation">
          <Link className="link-btn" to='/SignUp'>SignUp</Link>
          <Link className="link-btn" to='/ForgotPassword'>Forgot password?</Link>
        </div>
      </form>
    </div>
  )
}

export default SignIn;