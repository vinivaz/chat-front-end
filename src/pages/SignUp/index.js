import React, { useState, useLayoutEffect } from "react"
import { Link, useHistory } from 'react-router-dom';
import {api} from '../../services/api';
import { login, isAuthenticated } from '../../services/auth';
import './styles.css';
import logo from '../../assets/logo-bigger.svg'

const SignIn = () => {
  const [data, setData] = useState({
    name: '',
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

  const HandleSignUp = async (e)=> {
    e.preventDefault();
    const { name, email, password } = data;
    console.log(name, email, password);
    if (!name || !email || !password) {
      setData({...data,
        error: 'All field\'s required'
      })
    } else {
      const response = await api.post('/user/register', { name, email, password });
      console.log(response.data)
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
    <div className="SignUp">
      <form className="form" onSubmit={(e) => HandleSignUp(e)} >
        <div className="application-intro">
          <img src={logo} alt="logo"/>
          <span>Nexum</span>
        </div>
        <div className="page-info"><span>Sign Up</span></div>
        <input 
          className="input"
          placeholder="Name"
          type='text'
          onChange={e => (setData({...data,  name: e.target.value, error: ''}))}
        />
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
          <Link className="link-btn" to='/'>SignIn</Link>
          <Link className="link-btn" to='/ForgotPassword'>Forgot password?</Link>
        </div>
      </form>
    </div>
  )
}

export default SignIn;