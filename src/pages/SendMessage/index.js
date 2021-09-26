import React, { useState, useEffect, useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';

import { api } from '../../services/api'

import MessagePreview from '../MessagePreview';

import './styles.css';

export default function SendMessage(){
  const [newMessage, setNewMessage ] = useState();

  const answeringMessage = useSelector(state => state.answering_message);
  //const answeringMessage = useSelector(state => state.answering_message);

  const [isAnswering, setIsAnswering] = useState(false)

  const messageId = answeringMessage.message_id;

  const dispatch = useDispatch();

  const room = useSelector(state => state.room);

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
      .then(setNewMessage())
      .catch(function (error){
        console.log(error)
      })
      dispatch({type: 'SET_ANSWER_MESSAGE', data: {active:false, message_id: undefined}})
      let input = document.getElementById('sendMessageBox');
      input.value = ""
      
    }else{
      api.post(`/messages/`, { text: newMessage, room: room.room_id })
      .then(setNewMessage())
      .catch(function (error){
        console.log(error)
      })
      let input = document.getElementById('sendMessageBox');
      input.value = ""
    }
    
  }

  useEffect(() =>{

    setIsAnswering(answeringMessage.active)

    inputRef.current.focus();

    return () => {
      
    };
  }, [answeringMessage])

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
        <div className="interaction" style={{top: isAnswering? "-10px": "auto"}}>
        <input
          id="sendMessageBox"
          autoComplete="off"
          placeholder="Send message"
          ref={inputRef}
          onFocus={(e) => isFocused(e)}
          onChange={(e) =>setNewMessage(e.target.value.trim())}
        />
        <button id="send" onClick={() => sendMessage()}>send</button>
        </div>
      </div>
    </>  
  )
}