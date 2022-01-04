import React, { useState, useEffect, memo } from "react"
import { useSelector, useDispatch } from 'react-redux';

import { api } from '../../services/api'

import './styles.css'

function MessageReference({messageId}){
  const [ message, setMessage ] = useState()
  const profileId = useSelector(state => state.profile._id);
  const dispatch = useDispatch();

  const [ thisDisplay, setThisDisplay ] = useState('initial')

  function getMessageData(messageId){
    api.get(`/messages/singlemessage/${messageId}`)
    .then(response => {
      setMessage(response.data)
    })
  }

  useEffect(() => {
    getMessageData(messageId)
    return () => {
      setMessage() // This worked for me
    };
  }, [])

  useEffect(() => {
    if(message=== undefined|| message=== null)return;
      console.log(message.deletedTo)
      if(message.deletedTo === undefined ||message.deletedTo === null)return;
      if(message.deletedTo.includes(profileId)){
        console.log('apagaaaa')
        setThisDisplay('none')
      }
      
    
  }, [message])

  return(
    <div className="msg-ref" style={{display: thisDisplay}}>
      {message&&
        <div className="msg-ref-data">
          {message.url === undefined ? 
            <div className={`msg-ref-text ${message.userId._id=== profileId? "me":"them"}`}>
                {message.text.length > 32 ?
                  (message.text.slice(0,-(message.text.length - 32)) + "...")
                :
                  message.text
                }
              <div className="filler"></div>
            </div>
          :
            <div className="msg-ref-picture">
              <img src={`http://${message.url}`}  alt="message ref"/>
            </div>
          }
        </div>
      }
    </div>
  )
}

export default memo(MessageReference)

