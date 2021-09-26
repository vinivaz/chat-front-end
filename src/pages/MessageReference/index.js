import React, { useState, useEffect, memo } from "react"
import { useSelector, useDispatch } from 'react-redux';

import { api } from '../../services/api'

import './styles.css'

function MessageReference({messageId}){
  const [ message, setMessage ] = useState()
  const profileId = useSelector(state => state.profile._id);
  const dispatch = useDispatch();

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

  return(
    <div className="msg-ref">
      {message&&
        <div className="msg-ref-data">
          {message.url === undefined ? 
            <div className={`msg-ref-text ${message.userId._id=== profileId? "me":"them"}`}>
                {message.text.length > 45 ?
                  (message.text.slice(0,-(message.text.length - 45)) + "...")
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

