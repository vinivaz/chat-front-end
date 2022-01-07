import React, { useState, useEffect, useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';

import { api } from '../../services/api'

import { sendMsg, setUserTyping } from '../../services/socket';

import MessagePreview from '../MessagePreview';

import CropOriginalSharpIcon from '@material-ui/icons/CropOriginalSharp'

import { GrSend } from "react-icons/gr";

import './styles.css';


export default function SendMessage(){
  const [newMessage, setNewMessage ] = useState();

  const answeringMessage = useSelector(state => state.answering_message);

  const [isAnswering, setIsAnswering] = useState(false)

  const [thisUserTyping, setThisUserTyping ] = useState(false)

  const [ thisUserTypingTimer, setThisUserTypingTimer ] = useState(null)
  
  const messageId = answeringMessage.message_id;

  const dispatch = useDispatch();

  const room = useSelector(state => state.room);

  const profile = useSelector(state => state.profile);

  const inputRef = useRef();

  function isFocused(e){ 
    let button = document.getElementById('send')
    e.target.addEventListener("keyup", function(event){
      if (event.keyCode === 13) {
        button.click();
      }
    })
  }

  function sendMessage(){
    if(!newMessage) return;
    if(isAnswering === true){
      api.post(`/messages/`, { text: newMessage, room: room.room_id, respondedTo: messageId, })
      .then(response => {
        if(response.data.error)return;
        
        const newMsg = response.data.message
        dispatch({type: 'SET_NEW_MESSAGE', data: {active:true, message_data: newMsg}})
        dispatch({type: 'SET_ANSWER_MESSAGE', data: {active:false, message_id: undefined}})
        
        sendMsg(room.room_data, newMsg)
        //socket.emit('send-msg', newMsg, room.room_id, room.room_data)
      })
      .catch(function (error){
        console.log(error)
      })
      setNewMessage()
      dispatch({type: 'SET_ANSWER_MESSAGE', data: {active:false, message_id: undefined}})

      //dispatch({type: 'SET_NEW_MESSAGE', data: {active:true, message_id: undefined}})
      let input = document.getElementById('sendMessageBox');
      input.value = ""
      
    }else{
      api.post(`/messages/`, { text: newMessage, room: room.room_id })
      .then(response => {
        if(response.data.error)return;
        const newMsg = response.data.message

          dispatch({
            type: 'SET_NEW_MESSAGE',
            data: {active:true, message_data: newMsg}
          })
          
          
          //socket.emit('send-msg', newMsg, room.room_id, room.room_data)
          sendMsg(room.room_data, newMsg)
        })
      .catch(function (error){
        console.log(error)
      })
      setNewMessage()
      let input = document.getElementById('sendMessageBox');
      input.value = ""
    }
    
  }

  const onFileChange = async (e) => {
    if (e.target.files && e.target.files.length > 0) {

      if(isAnswering === true){

        let formData = new FormData();
        formData.append("file", e.target.files[0]);
        formData.append("room", room.room_id);
        formData.append("respondedTo", messageId);
        api.post(`/messages/image`, formData, {headers: {"Content-Type": `multipart/form-data; boundary=${formData._boundary}`}})
        .then(response => {
          if(response.data.error)return;
          const newMsg = response.data.message
          dispatch({
            type: 'SET_NEW_MESSAGE',
            data: {active:true, message_data: newMsg}
          })

          sendMsg(room.room_data, newMsg)
        })
        .catch(function (error){
          console.log(error)
        })
        dispatch({type: 'SET_ANSWER_MESSAGE', data: {active:false, message_id: undefined}})
        let input = document.getElementById('sendMessageBox');
        input.value = ""

      }else{
        let formData = new FormData();
        formData.append("file", e.target.files[0]);
        formData.append("room", room.room_id);

        api.post(`/messages/image`, formData, {headers: {"Content-Type": `multipart/form-data; boundary=${formData._boundary}`}})
        .then(response => {
          if(response.data.error)return;
          
          const newMsg = response.data.message
          sendMsg(room.room_data, newMsg)
          dispatch({
            type: 'SET_NEW_MESSAGE',
            data: {active:true, message_data: newMsg}
          })
          
        })
        .catch(function (error){
          console.log(error)
        })
        let input = document.getElementById('sendMessageBox');
        input.value = ""
      }
      e.target.value = null;
    }
  }

  useEffect(() =>{

    setIsAnswering(answeringMessage.active)

    inputRef.current.focus();

  }, [answeringMessage])

  let pic = '';
  
  const uploadClick = e => {
    pic.click();
    return false;
  };

  function typingFeedback(){
    if(!thisUserTyping){
      setThisUserTyping(true)
      setUserTyping(profile._id, true, room.room_id)
    }
    
    if(thisUserTypingTimer !== null){
      clearTimeout(thisUserTypingTimer)
      setThisUserTypingTimer(setTimeout(
      () => {
        setUserTyping(profile._id, false, room.room_id)
        setThisUserTyping(false)
      }, 1000))
    }else{
      setThisUserTypingTimer(setTimeout(
      () => {
        setUserTyping(profile._id, false, room.room_id)
        setThisUserTyping(false)
      }, 1000))
    }
  }

  return(
    <>
      <div className="send-msg">
        {isAnswering&&
          <>
            <div className="close-answer">
              <span
                id="close"
                onClick={() => dispatch({type: 'SET_ANSWER_MESSAGE', data: {active:false, message_id: undefined}})}
                className="close"
              >
                &times;
              </span>
            </div>
            <MessagePreview messageId={messageId}/>
          </>
        }
        <div className="interaction" >
          <span
            className="send-img-btn"
            onClick={uploadClick}
          >
            <input
              type="file"
              style={{ display: 'none'}}
              ref={input => {
                // assigns a reference so we can trigger it later
                pic = input;
              }}
              onChange={(e) => onFileChange(e) }
            />
            <CropOriginalSharpIcon sx={{ fontSize: 500 }}/>
          </span>
          <input
            id="sendMessageBox"
            autoComplete="off"
            placeholder="Send message"
            ref={inputRef}
            onFocus={(e) => isFocused(e)}
            onChange={(e) => {
              setNewMessage(e.target.value.trim())
              typingFeedback()
            }}
          />
          <span
            id="send"
            className="send-msg-btn"
            onClick={() => sendMessage()}
          >
            <GrSend/>
          </span>
        </div>
      </div>
    </>  
  )
}