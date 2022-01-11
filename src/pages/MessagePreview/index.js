import React, { useState, useEffect, memo } from "react"
import { useSelector } from 'react-redux';

import ImgHandler from "../ImgHandler"
import customImg from '../../assets/custom-img2.svg'

import { api } from '../../services/api'

import './styles.css'

function MessagePreview(){
  const [ message, setMessage ] = useState()
  const answeringMessage = useSelector(state => state.answering_message);


  function getMessageData(messageId){
    api.get(`/messages/singleMessage/${messageId}`)
    .then(response => {
      setMessage(response.data)
    })
  }

  useEffect(() =>{
    if(answeringMessage.active === true){
      getMessageData(answeringMessage.message_id)
    }
  },[answeringMessage])

  return(
    <div className="msg-pv">
      {message&&
        <div className="msg-pv-data">
          
          {message.url === undefined ? 
            <div className="msg-pv-text">
              <span>
                {message.text.length > 45 ?
                  (message.text.slice(0,-(message.text.length - 45)) + "...")
                :
                  message.text
                }
              </span>
              <div className="filler"></div>
            </div>
          :
            <div className="msg-pv-picture">
              <ImgHandler
              //src={'http://'+ message.url}
              src={message.url}
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

export default memo(MessagePreview)

