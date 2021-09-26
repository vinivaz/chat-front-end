import React, { useState, useLayoutEffect } from "react"
import { Link, useHistory } from 'react-router-dom';
import {api} from '../../services/api';
import { login, isAuthenticated } from '../../services/auth';
import './styles.css';

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
        error: 'Preencha todos os campos'
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
    <div className="SignIn">
      <form className="form" onSubmit={(e) => HandleSignUp(e)} >
        <h3 className="Logo">...</h3>
        <input 
          className="input"
          placeholder="Usuario"
          type='text'
          onChange={e => (setData({...data,  name: e.target.value, error: ''}))}
        />
        <input 
          className="input"
          placeholder="Email"
          type='text'
          onChange={e => (setData({...data,  email: e.target.value, error: ''}))}
        />
        <input 
          className="input"
          placeholder="Senha"
          type='password'
          onChange={e => (setData({...data, password: e.target.value, error: ''}))}
        />
        <button className="form-btn"  type="submit" >Cadastrar</button>
        <hr />
        <Link className="link-btn" to='/'>Entrar</Link>
        {data.error && <p className="alerti">{data.error}</p>}
        
      </form>
    </div>
  )
}

export default SignIn;