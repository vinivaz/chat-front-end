import React, { useState, useEffect, useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';

import { api } from '../../services/api';

export default function MessageOptions({show, messageId, messageAction}){

  const dispatch = useDispatch()

  const Tools = {
    "delete": {
      text: "delete this message?",
      finalAction: function(id){
        api.delete(`/messages/${id}`)
        .then(response =>{
          console.log(response.data)
          dispatch({type: "SET_DELETED_MESSAGE", data: {deleted_message: 0}})
        })
        .catch(function (error){
          console.log(error)
        })
      }  
    },
    "delete to me": {
      text: "only the other will se this message, confirm?",
      finalAction : function(id){
        console.log(id)
        api.put(`/messages/deleteToOne`, {messageId: id})
        .then(response =>{
          console.log(response.data)
          close()
        })
        .catch(function (error){
          console.log(error)
        })
      
      }
    },
    "answer": {
      finalAction : function (id){
        alert("answer")
      },
    } ,
    "room-options": {
      finalAction : function (id){
        console.log(true)
      },
    }
  }


  /*function checkTools(item){
    
    Object.keys(Tools).map(key => {
      if(key === item){
        console.log(Tools[key].text)
        setText(Tools[key].text)
        setMessageAction(window.message_action)
        //msgConfirmation[key].finalAction(window.message_id)
        console.log(key)
      }
    })
  }*/

  function close(){
    console.log("messageOptiosn")
    dispatch({type: "SET_IMAGE_WINDOW", data: {open:false, url:"", message_action: undefined, message_id: undefined}})
    
  }
  return(
    <>
      {messageId&&<div className="message-window">
        <span id="close" onClick={() => close()} className="close">&times;</span>
        <span>{Tools[messageAction].text}</span>
        <div className="buttons">
          <button 
            onClick={()=> {
              Tools[messageAction].finalAction(messageId) 
              close()
            }}
          >
            delete
          </button>
          <button onClick={() => close()}>cancel</button>
        </div>
      </div>}
    </>  
  )

}