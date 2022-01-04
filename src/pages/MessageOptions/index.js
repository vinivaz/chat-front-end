import React, { useEffect } from 'react';
import { useDispatch } from 'react-redux';

import { api } from '../../services/api';
import { deleteMsg } from '../../services/socket';

export default function MessageOptions({show, messageData, messageAction}){

  const dispatch = useDispatch()

  useEffect(() => {
    if(messageData!== undefined){
      console.log("messageOptions:",messageData._id)
    }
    
  }, [messageData])

  const Tools = {
    "delete": {
      text: "delete this message?",
      finalAction: function(id){
        api.delete(`/messages/${id}`)
        .then(response =>{
          console.log(response.data)
          close()
          dispatch({type: "SET_DELETED_MESSAGE", data: {deleted_message: messageData._id}})
          deleteMsg(messageData.room, messageData._id)
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
          dispatch({type: "HIDE_MSG_TO_ONE", data: {hidden_message: messageData._id}})
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
    dispatch({type: "UNSET_WINDOW"})
    
  }
  return(
    <>
      {messageData&&<div className="dialog-container">
        <span>{Tools[messageAction].text}</span>
        <div className="buttons">
          <button 
            onClick={()=> {
              Tools[messageAction].finalAction(messageData._id) 
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