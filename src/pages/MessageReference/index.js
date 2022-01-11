import React, { useState, useEffect, memo } from "react"
import { useSelector } from 'react-redux';

import { api } from '../../services/api'

import ImgHandler from '../ImgHandler'
import customImg from '../../assets/custom-img2.svg'

import './styles.css'

function MessageReference({messageId}){
  const [ message, setMessage ] = useState()
  const profileId = useSelector(state => state.profile._id);
  

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
      
      if(message.deletedTo === undefined ||message.deletedTo === null)return;
      if(message.deletedTo.includes(profileId)){
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
              <ImgHandler
                src={message.url}
                // src={`http://${message.url}`}
              >
                <img
                  src={customImg}
                  style={{filter: 'grayscale(70%)'}}
                />
              </ImgHandler>
            </div>
          }
        </div>
      }
    </div>
  )
}

export default memo(MessageReference)

