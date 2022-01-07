import React, { useState, useEffect, useRef } from 'react';

import ReactDOM from 'react-dom';

import { useDispatch, useSelector } from 'react-redux';

import { api } from '../../services/api'

import ImprovisedProfilePic from "../ImprovisedProfilePic"

import './styles.css';

export default function Users(){

  const [users, setUsers] = useState([]);
  
  const [ page, setPage ] = useState(1);

  const [pages, setPages ] = useState(1);
  
  const [ canScroll, setCanScroll ] = useState(false);

  const onlineUsers = useSelector(state => state.online_users);

  const [ dimentions, setDimentions ] = useState({
    width: window.innerWidth,
    height: window.innerHeight
  });

  const ref = useRef(null);
  const ref2 = useRef(null);

  const dispatch = useDispatch();

  const showUsers = useSelector(state => state.navigation.show_users);

  useEffect(()=>{
    if(showUsers === true){
      noScrollbarHandler()
    }
  }, [showUsers])

  const handleHideDropdown = (event) => {
    if (event.key === "Escape") {
      document.removeEventListener("keydown", handleHideDropdown, true);
      document.removeEventListener("click", handleClickOutside, true);
      dispatch({type: 'TOGGLE_USERS'})
    }
  };

  const handleClickOutside = event => {
    
    if (ref.current && !ref.current.contains(event.target)) {
      
      document.removeEventListener("keydown", handleHideDropdown, true);
      document.removeEventListener("click", handleClickOutside, true);
      dispatch({type: 'TOGGLE_USERS'})
    }
  };

  useEffect(() =>{
    if(showUsers === true){
      document.addEventListener("keydown", handleHideDropdown, true);
      document.addEventListener("click", handleClickOutside, true);
    }else{
      
      document.removeEventListener("keydown", handleHideDropdown, true);
      document.removeEventListener("click", handleClickOutside, true);
    }
  
    
  }, [showUsers])

  useEffect(() =>{
    window.addEventListener('resize', () =>{
      setDimentions({
        width: window.innerWidth,
        height: window.innerHeight
      })
    });
    
    return () => {
       window.removeEventListener('resize', () =>{
         setDimentions({
        width: window.innerWidth,
        height: window.innerHeight
      })
       });
    }
  },[]);


  useEffect(()=> {

    if((dimentions.width <=760) && showUsers===false){

    }else{
      if(users.length === 0){
        getUsers()
        noScrollbarHandler()
      }
    }

  },[dimentions, showUsers])

  function getUsers(){
    
    setPages(1)
    setUsers([])
    api.get('/user/list?page=1')
    .then((response) => {
      setUsers(response.data.docs)
      setPages(response.data.pages)
      noScrollbarHandler()
    })
    .catch(function (error){
      console.log(error);
    })
  };

  function getMoreUsers(e){

    const { scrollTop, clientHeight, scrollHeight } = e.currentTarget;

    const scrollBarPercenage = ((scrollTop/(scrollHeight - clientHeight))*100)
    
    if(canScroll === true){
      if(scrollBarPercenage >= 97){

        if(pages > page){
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

  function openWindow(userData){
    dispatch({
      type: "SET_WINDOW",
      data: {
        open:true,
        user_data: userData,
        app_options: false
      }
    })
  }

  function isUserOnline(userId){
    if(userId && onlineUsers){
      if(onlineUsers.includes(userId)){
        return true
      }else{
        return false
      }
    }
  }
  
  function noScrollbarHandler(){
    const isComponentShowing = window.getComputedStyle(ReactDOM.findDOMNode(ref2.current)).getPropertyValue("display");
    
    if(isComponentShowing=== 'none')return;
    if(users !== undefined){
      var varPage = page
      var varUsers = users
      const interv1 = setInterval(
        () => {
          console.log("setInterval is running")
          if(ref.current === null) {
            clearInterval(interv1)
            return
          } 
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
    <div
      className={`users ${showUsers === true? 'showing': 'not-showing'}`}
      ref={ref2}
      id="m"
    >
      <div 
        className="info-element"
        onClick={() => dispatch({type: 'TOGGLE_USERS'})}
      >
        Users
      </div>
      <div
        className="all-users"
        onScroll={(e) => getMoreUsers(e)}
        onLoad={() => noScrollbarHandler()}
        ref={ref}
      >
        {users.map(user => 
          <div className="users-item" key={user._id} onClick={() => openWindow(user)}>
            <div className="user-content">
              <div className="user-icon">
                {user.profile_img !== "" ?
                  <img
                    // src={"http://" + user.profile_img}
                    src={user.profile_img}
                    width="45"
                    height="45"
                    alt={<ImprovisedProfilePic circle={true} user={user} width={45} height={45}/>}
                    onError={() => {user.profile_img = ""}}
                  />
                : 
                  <ImprovisedProfilePic circle={true} user={user} width={45} height={45}/>
                }
                {isUserOnline(user._id) === true ?
                  <div className="online-sign"></div>
                  :
                  ''
                }
              </div>
              <div>{user.name}</div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

