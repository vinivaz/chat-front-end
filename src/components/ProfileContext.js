import React, { useState, useEffect } from 'react';
import { api }from "../services/api";

const ProfileContext = React.createContext();

const ProfileProvider = (props) => {
  

  const [state, setState] = useState({});

  useEffect(() => {
    
    const getProf = async() => {
      const resposta = await api.get('/user/profile/find')
      setState({state: resposta.data})
      console.log(state)
      
      
    }
    getProf()
  },[])

  useEffect(() => {
    
    const getProf = async() => {
      const resposta = await api.get('/user/profile/find')
      setState({state: resposta.data})
      console.log(state)
      
      
    }
    getProf()
    teste()
  },[])

  function teste (){
    console.log(state)
  }
  
  return (
    <ProfileContext.Provider value={[state, setState]}>
      {props.children}
    </ProfileContext.Provider>
  );
}

export { ProfileContext, ProfileProvider };

/*
const ProfileContext = React.createContext([{}, () => {}]);

const ProfileProvider = (props) => {
  const [state, setState] = useState(response);
  return (
    <ProfileContext.Provider value={[state, setState]}>
      {props.children}
    </ProfileContext.Provider>
  );
}

export { ProfileContext, ProfileProvider };
*/