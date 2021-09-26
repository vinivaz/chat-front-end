import React, { useLayoutEffect } from "react"
import { useHistory } from "react-router-dom";
import { Provider } from 'react-redux';

import { isAuthenticated } from '../../services/auth';
import store from '../../context/UserProfileContext';

import Main from '../../pages/Main'

export default function ContextProvider(){
  
  const history = useHistory()

  useLayoutEffect(() => {
    
    if(!isAuthenticated()){
      history.push('/')
    }
  }) 
  
  return(  
    <Provider store={store}>
      <Main/>
    </Provider>
  )
}

