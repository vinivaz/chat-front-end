import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';

import { api } from '../../services/api';

export default function UserOptions(props){

  const profile = useSelector(state => state.profile);

  const [confirmWindow, setconfirmWindow] = useState(false)

  const [userId, setUserId] = useState()

  const [ open, setOpen ] = useState(false)

  const dispatch = useDispatch()

  function close(){
    console.log("userOptions, close()")
    dispatch({type: "UNSET_WINDOW"})
    setUserId(undefined)
  }

  function deleteChatHistory(roomId){
    console.log(roomId)
  }

  function getUserHistory(userId){
    api.get(`/user/rooms/byUserId/${userId}`)
    .then(response => {
      
      if(response.data.room.length=== 0){
        api.post('/user/rooms', { usersReceiver: [userId] } )
        .then(response => {
          console.log(response)
          if(response.data.error){
            alert('failed, try again')
          }else{
            alert('deu bom, dps faço o resto')
          }
        })
      }else{
        console.log(response.data.room[0].users)
        
        const notYou = response.data.room[0].users.filter(props => props !==profile._id)
        if(notYou.length > 0){
          dispatch({type: 'SET_ROOM', data: { room_id: notYou }})
        }
        
      }
     
    })
  }

  function openProfile(profileId){
    dispatch({type:'SET_PROFILE_SECTION', data:profileId})
    close()
  }

  useEffect(() => {
    if (props.show=== true) {

      setUserId(props.userId)
      
    } else{
      close()
    }
  },[props.show])

  return(
    <>
      {confirmWindow === false? 
        <div className="message-window">
          <div
            className="window-options"
            onClick={() => openProfile(props.userId)}
          >
            <span>See profile</span>
          </div>
          {props.userId!==profile._id ? 
            <div
            className="window-options"
            onClick={() => getUserHistory(props.userId)}
            >
              <span>Send Message</span>
            </div>
          :
          ""
          } 
          <div
            className="window-options"
            onClick={() => close()}
          >
            <span>Cancel</span>
          </div>
        </div>
      :
        <div className="message-window">
          <span id="close" onClick={() => close()} className="close">&times;</span>
          <span>Delete all conversations?</span>
          <div className="buttons">
            <button 
              onClick={()=> {
                deleteChatHistory(userId) 
                close()
               }}
            >
              delete
            </button>
            <button onClick={() => close()}>cancel</button>
          </div>
        </div>
      }
    </>
  )
}