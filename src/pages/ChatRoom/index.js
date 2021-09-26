import React, { useState, useLayoutEffect, useEffect, useRef, memo} from 'react';
import { useSelector, useDispatch } from 'react-redux';

import MyMessage from "../MyMessage"
import SomeonesMessage from "../SomeonesMessage"
import SendMessage from "../SendMessage"
import ImprovisedProfilePic from "../ImprovisedProfilePic"
import { api } from '../../services/api'

import './styles.css';

function ChatRoom(){

  const room = useSelector(state => state.room);

  const deletedMessage = useSelector(state => state.deleted_message);

  const profileId = useSelector(state => state.profile._id);

  const dispatch = useDispatch();

  const [messages, setMessages] = useState([]);

  const [newMessage, setNewMessage ] = useState();

  const [chatProfile, setChatProfile ] = useState({})

  const [page, setPage] = useState(1)

  const [pages, setPages] = useState(1)

  const answeringMessage = useSelector(state => state.answering_message);
  
  const [isAnswering, setIsAnswering] = useState(false)

  const ref = useRef(null);

  useLayoutEffect(() => {
    setPage(1)
    setMessages([])
    setChatProfile({})
    
    getChatProfile()
    getMessages()
    return () => {
      //console.log("chatRoom esta desmontando")
    };
  }, [room])

  useEffect(() =>{
      deleteMessage()
    
  }, [deletedMessage])

  useEffect(() =>{
    setIsAnswering(answeringMessage.active)
    
  }, [answeringMessage])

  function loadContent(){
  
  }
  useEffect(() => {
    /*console.log("page:", page)
    console.log("pages:",pages)
    console.log("essa sala tem mais de uma pagina?", (page + 1) <= pages)
    console.log("pagina atual:", page + 1)

  */
  }, [page, pages])
  
  function getChatProfile(){
    api.get(`/user/rooms/${room.room_id}`)
    .then(response => {
      const chatUserId = response.data.room.users.filter(user => user !== profileId)
      api.get(`/user/profile/find/${chatUserId}`)
      .then(response => {
        setChatProfile(response.data)
      })
      .catch(function (error){
        console.log(error)
      })
    })
    .catch(function(error){
      console.log(error)
    })
  }
  //essa aqui é a atual utilizada
  function getMessages(){
    console.log("get messages esta executando")
    api.get(`/messages/${room.room_id}?page=1`)
    .then((firstResponse) => {
      setPages(firstResponse.data.pages)
      if(firstResponse.data.pages > 1){
        console.log("isso aqui so pode executar em sala com mais de uma pagina")
        api.get(`/messages/${room.room_id}?page=2`)
        .then(secondResponse =>{
          setMessages([...firstResponse.data.docs, ...secondResponse.data.docs])
          setPage(2)
        })
        .catch(function (error){
          console.log(error)
        })
      }else{
        console.log("essa sala tem 1 pagina")
        setMessages([...firstResponse.data.docs]);
        return
      }
    })
    .catch(function (error){
      console.log(error)
    })
  }


/*
  
  function getMessages(){
    api.get(`/messages/${room.room_id}?page=1`)
    .then((firstResponse) => {
      setPage(1)
      setPages(firstResponse.data.pages)
      
      if(firstResponse.data.docs.length <= 5){
        console.log("eu n deveria estar sendo execultado em hate")
        if(firstResponse.data.pages > 1){
          api.get(`/messages/${room.room_id}?page=${page + 1}`)
          .then(secondResponse =>{
            setMessages([...secondResponse.data.docs, ...firstResponse.data.docs])
            setPage(...page + 1)
          })
          .catch(function (error){
            console.log(error)
          })
        }else{
          setMessages([...firstResponse.data.docs]);
          return
        }
      }else{
        console.log("eu tenho q ser executaldo em me e odeio")
        setMessages([...firstResponse.data.docs]);
      }
    })
    .catch(function (error){
      console.log(error)
    })
  }
  
*/
  function getMoreMessages(){
    console.log("getMoreMessages esta sendo executado")
    // on the second search for messages, the div messages scrollbar is acctivated
    //so is necessary to stop the component to search for messages till the first
    //search ends
    if(messages.length > 0){
      if((page + 1) <= pages){
        setTimeout(() =>{
          api.get(`/messages/${room.room_id}?page=${page + 1}`)
          .then((response) => {
            console.log(messages)
            setMessages([...messages, ...response.data.docs])
            setPage(page + 1)
          })
          .catch(function (error){
            console.log(error)
          })
        }, 100)
      }else{
        return
      }
    }else{
      return
    }
  }

  function deleteMessage(){
    if(deletedMessage !== null){
      
      setPage(1)
      setMessages([])
      getMessages()
      //loadContent()
      
      dispatch({type: "SET_DELETED_MESSAGE", data: {deleted_message: null}})
    }
  }

  function scrollDown(){
    var chat = document.querySelector('.messages');
    if(chat){
      chat.scrollTo(0, chat.scrollHeight)
    }
  }

  const handleScroll = (e) => {
    const { scrollTop, clientHeight, scrollHeight } = e.currentTarget;

    const scrollBarPercenage = (((scrollTop/(scrollHeight - clientHeight)) * -1)*100)
    console.log(scrollBarPercenage)
    if(scrollBarPercenage > 97){
      getMoreMessages()
    }
  }

  function noScrollbarHandler(){
    console.log("noscrollhandler")
    var varPage = page
    var varMessages = messages
    const interv = setInterval(
      () => {
        console.log("tem um setInterval sendo execultado")
        const { clientHeight, scrollHeight } = ref.current
        console.log(clientHeight, scrollHeight)
        //guarantee that component keeps loading data when there's no scrollbar
        if(((clientHeight - scrollHeight) === 1)|| clientHeight === scrollHeight){
          if(pages > varPage){

            varPage++
            api.get(`/messages/${room.room_id}?page=${varPage}`)
            .then((response) => {
              varMessages = [...varMessages, ...response.data.docs];
              setMessages(varMessages)
            })
            .catch(function (error){
              console.log(error);
            })
          }else{
            clearInterval(interv)
            setMessages(varMessages)
            setPage(varPage)
          }
        }else{
          clearInterval(interv)
          setMessages(varMessages)
          setPage(varPage)
        }
      }
    ,1500) 
  }

  function showImgMsg(url){
    dispatch({type: "SET_IMAGE_WINDOW", data: {open: true, url: url}})
  }

  function isFocused(e){ 
    let button = document.getElementById('send')
    e.target.addEventListener("keyup", function(event){
      if (event.keyCode === 13) {
        button.click();
      }
    })
  }
 
  if(messages !== undefined && chatProfile !== undefined && page !== undefined && pages !== undefined){
    //console.log("messages",messages)
    //console.log("chatProfile",chatProfile)
    //console.log("Page", page)
    //console.log("pages", pages)
  }
  return(
    <div className="chat-room">
      {chatProfile&&
        <div
        className="user-data"
        style={{top: isAnswering? "10px": "auto"}}
        onClick={() => dispatch({type: "TESTE", data: "i hate myself"})}
        >
          {chatProfile.profile_img !== "" ?
            <img src={"http://" + chatProfile.profile_img} width="50" height="50" alt="perfil"/>
          : 
            <ImprovisedProfilePic circle={true} user={chatProfile} width={50} height={50}/>
          }
          <span>{chatProfile.name}</span>
        </div>
      }
      <div className="send-message">
        <div
        className="messages"
        style={{top: isAnswering? "10px": "auto"}}
        onScroll={(e) => handleScroll(e)}
        //onLoad={() => noScrollbarHandler()}
        ref={ref}
        >
          {messages&&Object.keys(messages).map(key => (
            messages[key].userId._id=== profileId?
            <MyMessage message={messages[key]} key={key}/>:
            <SomeonesMessage message={messages[key]} key={key} />
          ))}
          {messages&&messages.length <= 5? <div className="msg-box"><div className="void"></div></div>:''}
        </div>
        <SendMessage/>
      </div>
    </div>
  )
}

export default memo(ChatRoom);