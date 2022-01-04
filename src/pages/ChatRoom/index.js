import React, { useState, useEffect, useRef, memo } from 'react';
import { useSelector, useDispatch } from 'react-redux';

import MyMessage from "../MyMessage"
import SomeonesMessage from "../SomeonesMessage"
import SendMessage from "../SendMessage"
import ImprovisedProfilePic from "../ImprovisedProfilePic"
import Loading2 from "../Loading2"
import TypingAnimation from '../TypingAnimation';

import { api } from '../../services/api'

import {
  initiateSocket,
  switchRooms,
  subscribeToChat,
  onRequestToDeleteChatRoom,
  onOtherUserTyping,
  onMessageDeleted 
} from '../../services/socket'

import './styles.css';

function ChatRoom(){
  
  const room = useSelector(state => state.room);

  const deletedMessage = useSelector(state => state.deleted_message);

  const hiddenMessage = useSelector(state => state.hidden_message);

  const profileId = useSelector(state => state.profile._id);

  const newMessageSent = useSelector(state => state.new_message);

  const answeringMessage = useSelector(state => state.answering_message);

  const dispatch = useDispatch();

  const [messages, setMessages] = useState([]);

  const [newMessage, setNewMessage ] = useState([]);

  const [chatProfile, setChatProfile ] = useState({})

  const [page, setPage] = useState(1)

  const [pages, setPages] = useState(1)

  const [isAnswering, setIsAnswering] = useState(false)

  const [ canGetMoreMsg, setCanGetMoreMsg ] = useState(false)

  const [ loading, setLoading ] = useState(false)

  const [ otherUserTyping, setOtherUserTyping ] = useState(false)

  const [ otherUserTypingTimer, setOtherUserTypingTimer ] = useState(null)

  const [ msgIdToDelete, setMsgIdToDelete ] = useState(null)

  const onlineUsers = useSelector(state => state.online_users)

  const [ isOnline, setIsOnline ] = useState(false)

  const ref = useRef(null);



  const prevRoomRef = useRef();

  //
  useEffect(() => {
    prevRoomRef.current = room.room_id;
    
  });
  const prevRoom = prevRoomRef.current;

  useEffect(() => {
    if (prevRoom && room.room_id) switchRooms(prevRoom, room.room_id);
    else if (room.room_id) initiateSocket(room.room_id);
    setPage(1)
    setMessages([])
    setNewMessage([])
    setChatProfile({})
    getChatProfile()
    getMessages()
    setCanGetMoreMsg(true)
    // Reset chat messages upon change in room
    // Avoid subscribeToChat as it will duplicate subscriptions.
  }, [room]);

  useEffect(() => {
    subscribeToChat((err, data) => {
      if(err) return;
      
      setNewMessage(oldMessages =>[...oldMessages, ...[data]])
      setOtherUserTyping(false)
    });
  }, []);

  useEffect(() => {
    onMessageDeleted((err, msgId) => {
      if(err) return;
      console.log(msgId)
      setMsgIdToDelete(msgId)

    });
  }, []);

  useEffect(() =>{
    if(msgIdToDelete){
      removeMsg(msgIdToDelete)
    }
  },[msgIdToDelete])

  useEffect(() =>{
    if(deletedMessage !== null){
      removeMsg(deletedMessage)
      dispatch({type: "SET_DELETED_MESSAGE", data: {deleted_message: null}})
    }
  
  }, [deletedMessage, messages, newMessage])

  useEffect(() =>{
    if(hiddenMessage !== null){
      hideMsgToOneUser(hiddenMessage)
      dispatch({type: "HIDE_MSG_TO_ONE", data: {deleted_message: null}})
    }
    console.log(messages, newMessage)
  }, [hiddenMessage, messages, newMessage])

  useEffect(() => {
    onRequestToDeleteChatRoom((err, data) => {
      if(err) return;
      
      setNewMessage()
      setMessages()
      dispatch({type:'SET_PROFILE_SECTION', data:profileId})
    });
  }, []);

  useEffect(() => {
    onOtherUserTyping((err, userId, value) => {
      if(err) return;
      if(userId !== profileId){
        if(value===true){
          if(!otherUserTyping){
            setOtherUserTyping(true)
            setOtherUserTypingTimer(setTimeout(
              () => {
                setOtherUserTyping(false)
              },
              100000
            ))
          }else{
            setOtherUserTyping(true)
            clearTimeout(otherUserTypingTimer)
            setOtherUserTypingTimer(setTimeout(
              () => {
                setOtherUserTyping(false)
              },
              100000
            ))
          }
        }else{
          setOtherUserTyping(false)
        }
      }
    })
  },[])

  useEffect(() => {
    if(newMessageSent.active === true){
      setNewMessage([...newMessage, ...[newMessageSent.message_data]])
      dispatch({type: 'SET_NEW_MESSAGE', data: {active:false, message_data: undefined}})
    }
  
  }, [newMessageSent])

  useEffect(() => {
    console.log(chatProfile)
    if(chatProfile._id && onlineUsers){
      if(onlineUsers.includes(chatProfile._id)){
        setIsOnline(true)
      }else{
        setIsOnline(false)
      }
      
    }
  
  },[onlineUsers, chatProfile])

  /*
    this function search for an Id to modify
    on the const messages and newMessage, so we
    could set the display none with css
   */
  function removeMsg(msgId){
    
    let delFromMessages = messages.findIndex(x => x._id === msgId);

    console.log(messages)
    console.log(delFromMessages)
    if(delFromMessages === -1){
      
      let delFromNewMessage = newMessage.findIndex(x => x._id === msgId);
      console.log(newMessage)
      console.log(delFromNewMessage)
      if(delFromNewMessage !== -1){
        let newMsg = newMessage;
        newMsg[delFromNewMessage].deleted = true
        setNewMessage([...newMsg])
      }else{
        return
      }  
    }else{
      let msgs = messages;
      msgs[delFromMessages].deleted = true
      setMessages([...msgs])
    }
  }

  function hideMsgToOneUser(msgId){
    
    let delFromMessages = messages.findIndex(x => x._id === msgId);

    console.log(messages)
    console.log(delFromMessages)
    if(delFromMessages === -1){
      
      let delFromNewMessage = newMessage.findIndex(x => x._id === msgId);
      console.log(newMessage)
      console.log(delFromNewMessage)
      if(delFromNewMessage !== -1){
        let newMsg = newMessage;
        newMsg[delFromNewMessage].deletedTo = profileId
        setNewMessage([...newMsg])
      }else{
        return
      }  
    }else{
      let msgs = messages;
      msgs[delFromMessages].deletedTo = profileId
      setMessages([...msgs])
    }
  }

  
  useEffect(() =>{
    setIsAnswering(answeringMessage.active)
    
  }, [answeringMessage])
  
  function getMessages(){
    console.log("get messages esta executando")
    api.get(`/messages/${room.room_id}?page=1`)
    .then((firstResponse) => {
      setPages(firstResponse.data.pages)
      if(firstResponse.data.pages > 1){
        api.get(`/messages/${room.room_id}?page=2`)
        .then(secondResponse =>{
          setMessages([...firstResponse.data.docs, ...secondResponse.data.docs])
          setPage(2)
        })
        .catch(function (error){
          console.log(error)
        })
      }else{
        setMessages([...firstResponse.data.docs]);
        return
      }
    })
    .catch(function (error){
      console.log(error)
    })
  }
  
  function getChatProfile(){

    const you = room.room_data.users.filter(x => x._id !== profileId)
    console.log(you)
    setChatProfile(you[0])
  }

  
  const handleScroll = (e) => {

    const { scrollTop, clientHeight, scrollHeight } = e.currentTarget;

    const scrollBarPercenage = (((scrollTop/(scrollHeight - clientHeight))* -1)*100)
    if(scrollBarPercenage >=97){
      if(canGetMoreMsg===true){
        getMoreMessages()
      }
    }
  }
  

  function getMoreMessages(){
    
    // on the second search for messages, the div messages scrollbar is acctivated
    //so is necessary to stop the component from searching for messages till the first
    //search ends

    setCanGetMoreMsg(false)
    if(messages.length > 0){
      if((page + 1) <= pages){
        setLoading(true)
        setTimeout(() =>{
          api.get(`/messages/${room.room_id}?page=${page + 1}`)
          .then((response) => {
            setMessages([...messages, ...response.data.docs])
            setPage(page + 1)
            setCanGetMoreMsg(true)
            setLoading(false)
          })
          .catch(function (error){
            console.log(error)
            setCanGetMoreMsg(true)
            setLoading(false)
          })
        }, 300)
      }else{
        return
      }
    }else{
      return
    }
  }


  function scrollDown(){
    var chat = document.querySelector('.messages');
    //console.log(chat)
    //console.log(chat.scrollHeight)
    chat.scrollTo(0, chat.scrollHeight)
    if(chat){
      chat.scrollTo(0, chat.scrollHeight)
    }
  }

  function noScrollbarHandler(){
    console.log("noScrollhandler esta sendo executado")
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
 
  return(
    <div className="chat-room">
      {chatProfile&&
        <div
          className="user-data"
        > 
          <div className="user-icon">
            {chatProfile.profile_img !== "" ?
              <img src={"http://" + chatProfile.profile_img} width="50" height="50" alt="perfil"/>
            : 
              <ImprovisedProfilePic circle={true} user={chatProfile} width={50} height={50}/>
            }
            {isOnline === true ?
              <div className="online-sign"></div>
              :
              ''
            }
          </div>
          <div className="user">{chatProfile.name}</div>
          <div className="chat-room-loading">
            <div className={`loading-corner ${loading&&'show'}`}>
              {<Loading2/>}
            </div>
          </div>
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
          <div className="new-messages">
            {newMessage&&Object.keys(newMessage).map(key => (
              newMessage[key].userId._id=== profileId?
              <MyMessage
                message={newMessage[key]}
                key={key}
                deleted={newMessage[key].deleted !== true ? false : true}
              />
            :
              <SomeonesMessage
                message={newMessage[key]}
                key={key}
                deleted={newMessage[key].deleted !== true ? false : true}
              />
            ))}
            {otherUserTyping&&<div className="msg-box"><TypingAnimation/></div>}
          </div>
          {messages&&Object.keys(messages).map(key => (
            messages[key].userId._id=== profileId?
            <MyMessage
              message={messages[key]}
              key={key}
              deleted={messages[key].deleted !== true ? false : true}
            />:
            <SomeonesMessage
              message={messages[key]}
              key={key}
              deleted={messages[key].deleted !== true ? false : true}
            />
          ))}
          {messages&&messages.length <= 5? <div className="msg-box"><div className="void"></div></div>:''}  
        </div>
        <SendMessage/>
      </div>
    </div>
  )
}

export default memo(ChatRoom);

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

  // useEffect(() => {
  //   console.log("adicionando nova mensagem")
   
  //   if(newMessageSent.active === true){
  //     //test(newMessageSent.message_data)
  //     //setNewMessage([...newMessage, ...[newMessageSent.message_data]])

  //     //socket.emit("test", newMessageSent.message_data.text)
  //     //dispatch({type: 'SET_NEW_MESSAGE', data: {active:false, message_data: undefined}})
  //   }
  
  // }, [newMessageSent])

  //this is was a try, when the message flex-direction wasn't colunm-reverse
  // function getMessages(){
  //   console.log("get messages esta executando")
  //   api.get(`/messages/${room.room_id}?page=1`)
  //   .then((firstResponse) => {
  //     setPages(firstResponse.data.pages)
  //     if(firstResponse.data.pages > 1){
  //       console.log("isso aqui so pode executar em sala com mais de uma pagina")
  //       api.get(`/messages/${room.room_id}?page=2`)
  //       .then(secondResponse =>{
  //         setMessages([...secondResponse.data.docs.reverse(), ...firstResponse.data.docs.reverse()])
  //         setPage(2)
  //         scrollDown()
  //         setCanGetMoreMsg(true)
  //       })
  //       .catch(function (error){
  //         console.log(error)
  //       })
  //     }else{
  //       console.log("essa sala tem 1 pagina")
  //       setMessages([...firstResponse.data.docs.reverse()]);
  //       scrollDown()
  //       setCanGetMoreMsg(true)
  //       return
  //     }
  //   })
  //   .catch(function (error){
  //     console.log(error)
  //   })
  // }

  
  // const handleScroll = (e) => {

  //   console.log('handleScroll esta sendo executado')
  //   const { scrollTop, clientHeight, scrollHeight } = e.currentTarget;

  //   const scrollBarPercenage = (((scrollTop/(scrollHeight - clientHeight)) * -1)*100)
  //   console.log(scrollBarPercenage)
  //   if(scrollBarPercenage > 97){
  //     if(canGetMoreMsg===true){
  //       getMoreMessages()
  //     }
  //   }
  // }

  // function getMoreMessages(){

  //   //determinar q so busque mais mensagens quando terminar a primeira busca
  //   //na api e dps aoutomaticamente rolar pra baixo, so pra dps habilitar o
  //   //mais busca de mensagens
  //   console.log("getMoreMessages esta sendo executado")
  //   // on the second search for messages, the div messages scrollbar is acctivated
  //   //so is necessary to stop the component to search for messages till the first
  //   //search ends

  //   setCanGetMoreMsg(false)
  //   if(messages.length > 0){
  //     if((page + 1) <= pages){
  //       setTimeout(() =>{
  //         api.get(`/messages/${room.room_id}?page=${page + 1}`)
  //         .then((response) => {
  //           console.log([...response.data.docs.reverse(), messages])
  //           setMessages([])
  //           setMessages([...response.data.docs.reverse(), ...messages])
  //           setPage(page + 1)
  //           setCanGetMoreMsg(true)
  //         })
  //         .catch(function (error){
  //           console.log(error)
  //           setCanGetMoreMsg(true)
  //         })
  //       }, 1000)
  //     }else{
  //       return
  //     }
  //   }else{
  //     return
  //   }
  // }

