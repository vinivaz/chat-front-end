import React, { useState, useEffect, useRef } from 'react';
import {IoEllipsisVerticalSharp, IoEllipsisVertical } from "react-icons/io5";
import { useDispatch } from 'react-redux';

import { api } from '../../services/api'
import ImprovisedProfilePic from "../ImprovisedProfilePic"
import './styles.css';

export default function Users(){
  const [users, setUsers] = useState([]);
  const [ canScroll, setCanScroll ] = useState(false)
  const [ page, setPage ] = useState(1);
  const [pages, setPages ] = useState(1);
  const [ test, setTest ] = useState({
    scrollTop: '',
    clientHeight: '',
    scrollHeight: '',
    scrollH_scrollT: '',
    porcentagem: ''
  });

  const ref = useRef(null);

  const dispatch = useDispatch();

  useEffect(()=>{
    getUsers()
    
  },[]);
/*
  useEffect(() =>{
    console.log(test)
    
  }, [test]);*/

  function getUsers(){
    api.get('/user/list?page=1')
    .then((response) => {
      setUsers(response.data.docs)
      setPages(response.data.pages)
    })
    .catch(function (error){
      console.log(error);
    })
  };

  function getMoreUsers(e){
    console.log("getMoreUser esta sendo executado")

    const { scrollTop, clientHeight, scrollHeight } = e.currentTarget;

    const scrollBarPercenage = ((scrollTop/(scrollHeight - clientHeight))*100)
  
    console.log("pages: ", pages)
    console.log("page: ", page)
    
    if(canScroll === true){
      if(scrollBarPercenage >= 97){

        if(pages > page){
          console.log("atualixar")
          api.get(`/user/list?page=${page + 1}`)
          .then((response) => {
            setUsers([...users, ...response.data.docs]);
            setPage(page + 1)
          })
          .catch(function (error){
            console.log(error);
          })
        }else{
          return
        }
      }else{
        return
      }
    }else{
      return
    }
  };

  function openWindow(id){
    dispatch({type: "SET_WINDOW", data: {open:true,  user_id: id, app_options: false}})
    console.log(id)
    /*Object.keys(tools).map(key => {
      if(key === item){
        tools[key](id)
        console.log(key)
      }
    })*/
  }
  
  function noScrollbarHandler(){
    if(users !== undefined){
      var varPage = page
      var varUsers = users
      const interv1 = setInterval(
        () => {
          console.log("tem um setInterval sendo execultado")
          const { clientHeight, scrollHeight } = ref.current

          var scrollbarNotShowing = ((clientHeight - scrollHeight) === 1)|| clientHeight === scrollHeight || ((clientHeight - scrollHeight) === 0)
        
          if(pages !== varPage){
            //if the scrollbar is not showing
            if(scrollbarNotShowing){
              varPage++
              api.get(`/user/list?page=${varPage}`)
              .then((response) => {
                varUsers = [...varUsers, ...response.data.docs]
                setUsers(varUsers)
              })
            }else{
              clearInterval(interv1)
              setPage(varPage)
              setCanScroll(true)
            }
          }else{
            clearInterval(interv1)
            setPage(varPage)
            setCanScroll(true)
          }
        },
        900
        ) 
    }
  }

  return(
    <div className="users">
      <div className="info-element">users</div>
      <div
      className="all-users"
      onScroll={(e) => getMoreUsers(e)}
      onLoad={() => noScrollbarHandler()}
      ref={ref}
      >
        {users.map(user => 
          <div className="users-item" key={user._id} onClick={() => openWindow(user._id)}>
            <div className="user-content">

              {user.profile_img !== "" ?
                <img src={"http://" + user.profile_img} width="45" height="45" alt={"profile picture of " + user.name}/>
              : 
                <ImprovisedProfilePic circle={true} user={user} width={45} height={45}/>
              }
              <div>{user.name}</div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

/*
<div className="users-item">
          <div className="user-content">
            <img width="45" height="45" src="http://localhost:3000/files/profile/aed52abcf1eb89c08a8927b4d44cfc3b-teste.jpeg" alt="profile picture of someone"/>
            <div>nome custom</div>
            
          </div>
          
        </div>
        <div className="users-item">
          <div className="user-content">
            <img width="45" height="45" src="http://localhost:3000/files/profile/aed52abcf1eb89c08a8927b4d44cfc3b-teste.jpeg" alt="profile picture of someone"/>
            <div>nome custom</div>
            
          </div>
          
        </div>
        <div className="users-item">
          <div className="user-content">
            <img width="45" height="45" src="http://localhost:3000/files/profile/aed52abcf1eb89c08a8927b4d44cfc3b-teste.jpeg" alt="profile picture of someone"/>
            <div>nome custom</div>
            
          </div>
         
        </div>
        <div className="users-item">
          <div className="user-content">
            <img width="45" height="45" src="http://localhost:3000/files/profile/aed52abcf1eb89c08a8927b4d44cfc3b-teste.jpeg" alt="profile picture of someone"/>
            <div>nome custom</div>
            
          </div>
          
        </div>
        <div className="users-item">
          <div className="user-content">
            <img width="45" height="45" src="http://localhost:3000/files/profile/aed52abcf1eb89c08a8927b4d44cfc3b-teste.jpeg" alt="profile picture of someone"/>
            <div>nome custom</div>
            
          </div>
         
        </div>
        <div className="users-item">
          <div className="user-content">
            <img width="45" height="45" src="http://localhost:3000/files/profile/aed52abcf1eb89c08a8927b4d44cfc3b-teste.jpeg" alt="profile picture of someone"/>
            <div>nome custom</div>
            
          </div>
          
        </div>
        <div className="users-item">
          <div className="user-content">
            <img width="45" height="45" src="http://localhost:3000/files/profile/aed52abcf1eb89c08a8927b4d44cfc3b-teste.jpeg" alt="profile picture of someone"/>
            <div>nome custom</div>
            
          </div>
          
        </div>
        <div className="users-item">
          <div className="user-content">
            <img width="45" height="45" src="http://localhost:3000/files/profile/aed52abcf1eb89c08a8927b4d44cfc3b-teste.jpeg" alt="profile picture of someone"/>
            <div>nome custom</div>
            
          </div>
          
        </div>
        <div className="users-item">
          <div className="user-content">
            <img width="45" height="45" src="http://localhost:3000/files/profile/aed52abcf1eb89c08a8927b4d44cfc3b-teste.jpeg" alt="profile picture of someone"/>
            <div>nome custom</div>
            
          </div>
          
        </div>
        <div className="users-item">
          <div className="user-content">
            <img width="45" height="45" src="http://localhost:3000/files/profile/aed52abcf1eb89c08a8927b4d44cfc3b-teste.jpeg" alt="profile picture of someone"/>
            <div>nome custom</div>
            
          </div>
          
        </div>
*/