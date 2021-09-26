import React, { useState, useLayoutEffect } from "react"
import { Link, useHistory } from 'react-router-dom';
import { api } from '../../services/api';
import { login, isAuthenticated } from '../../services/auth';
import './styles.css';

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
        error: 'Preencha todos os campos'
      })
    } else {
      const response = await api.post('/user/authenticate', { email, password });
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
      <form className="form" onSubmit={(e) => HandleSignIn(e)} >
        <h3 className="Logo">...</h3>
        <input 
          className="input"
          placeholder="Usuario"
          type='text'
          onChange={e => (setData({...data,  email: e.target.value, error: ''}))}
        />
        <input 
          className="input"
          placeholder="Senha"
          type='password'
          onChange={e => (setData({...data, password: e.target.value, error: ''}))}
        />
        <button className="form-btn"  type="submit" >Entrar</button>
        <hr />
        <Link className="link-btn" to='/SignUp'>Cadastrar</Link>
        {data.error && <p className="alerti">{data.error}</p>}
        <Link className="forgot" to='/'>Esqueceu a senha?</Link>
      </form>
    </div>
  )
}

export default SignIn;