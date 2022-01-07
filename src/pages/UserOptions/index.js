import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';

import { api } from '../../services/api';

export default function UserOptions(props){

  const profile = useSelector(state => state.profile);

  const [confirmWindow] = useState(false)

  const [userId, setUserId] = useState()


  const dispatch = useDispatch()

  function close(){
    
    dispatch({type: "UNSET_WINDOW"})
    setUserId(undefined)
  }

  function deleteChatHistory(roomId){
    console.log(roomId)
  }

  function getUserHistory(userId){
    
    
    api.post(`/user/rooms/byUsers`, {id1: userId, id2: profile._id})
    .then(firstResponse => {
      if(firstResponse.data.error)return;
      if(firstResponse.data.room.length=== 0){

        api.post(`/user/rooms/byUsers`, {id1: profile._id, id2: userId})
        .then(secondResponse => {
          if(secondResponse.data.error)return;
          if(secondResponse.data.room.length=== 0){

            api.post('/user/rooms', { usersReceiver: [userId] } )
            .then(response => {

              if(response.data.error){
                alert('failed, try again')
                close()
              }else{
                dispatch({type: 'SET_ROOM', data: { room_id: response.data.room._id, room_data: response.data.room }})
                close()
              }
            })
          }else{
            
            const room_id = secondResponse.data.room[0]._id;
            dispatch({type: 'SET_ROOM', data: { room_id, room_data: secondResponse.data.room[0] }})
            close()
          }
        })
      
      }else{
        
        const room_id = firstResponse.data.room[0]._id;
        dispatch({type: 'SET_ROOM', data: { room_id, room_data: firstResponse.data.room[0] }})
        close()
      }
     
    })
  }

  function openProfile(userData){
    dispatch({type:'SET_PROFILE_SECTION', data:userData})
    close()
  }

  useEffect(() => {
    if (props.show=== true) {

      setUserId(props.userData._id)
      
    } else{
      close()
    }
  },[props.show])

  return(
    <>
      {confirmWindow === false? 
        <div className="dialog-container">
          <div
            className="window-options"
            onClick={() => openProfile(props.userData)}
          >
            <span>Open profile</span>
          </div>
          {props.userData._id!==profile._id ? 
            <div
            className="window-options"
            onClick={() => getUserHistory(props.userData._id)}
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
          
          <span className="dialog">Delete all conversations?</span>
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