import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';

import { api } from '../../services/api';

export default function ProfileOptions(props){

  const profile = useSelector(state => state.profile);

  const [confirmWindow, setconfirmWindow] = useState(false)

  const [userId, setUserId] = useState()

  const dispatch = useDispatch()

  function close(){
    setconfirmWindow(false)
    
    dispatch({type: "UNSET_WINDOW"})
    setUserId(undefined)
  }

  const onFileChange = async (e) => {
    
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0]
      let imageDataUrl = await readFile(file)
      e.target.value = null;
      dispatch({
        type: "SET_PROFILE_PIC",
        data: {
          open: true,
          url_data: imageDataUrl
        }
      })
      close()
    }
  }

  function readFile(file) {
    return new Promise((resolve) => {
      const reader = new FileReader()
      reader.addEventListener('load', () => resolve(reader.result), false)
      reader.readAsDataURL(file)
    })
  }

  function getUserHistory(userId){
    
    
    api.post(`/user/rooms/byUsers`, {id1: userId, id2: profile._id})
    .then(firstResponse => {

      if(firstResponse.data.room.length=== 0){

        api.post(`/user/rooms/byUsers`, {id1: profile._id, id2: userId})
        .then(secondResponse => {

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

  function showProfilePic(){
    
    dispatch({type: "SET_WINDOW", data: {open: true, url: props.profileData.profile_img}})
  }

  function deleteProfilePic(){
    api.post(`/user/profile/remove`)
    .then(response => {
      
      close()
    })
  }

  useEffect(() => {
    if (props.show=== true) {
      
      setUserId(props.profileData._id)
      
    } else{
      close()
    }
  },[props.show])

  let inputFile = '';
  
  const uploadClick = e => {
    inputFile.click();
    return false;
  };

  return(
    <>
      {confirmWindow === false? 
        <div className="dialog-container">
          {props.profileData.profile_img !== "" ?
            <div
            className="window-options"
            onClick={() => showProfilePic()}
            >
              <span>Open Picture</span>
            </div>
          :
            ""
          }
          {props.profileData._id === profile._id ?
          <> 
            <div
              className="window-options"
              onClick={uploadClick}
            >
              <input
                type="file"
                style={{display: "none"}}
                onChange={(e) => onFileChange(e)}
                name="fileUpload"
                ref={input => {
                // assigns a reference so we can trigger it later
                inputFile = input;
                }}
              />
              <span>Insert Picture</span>
            </div>
            <div
              className="window-options"
              onClick={() => setconfirmWindow(true)}
            >
              <span>Remove Picture</span>
            </div>
          </>  
          :
            <div
            className="window-options"
            onClick={() => getUserHistory(userId)}
            >
              <span>Send Message</span>
            </div>
          }
            <div
              className="window-options"
              onClick={() => close()}
            >
              <span>Cancel</span>
            </div>
        </div>
      :
        <div className="dialog-container">
          <span className="dialog">Delete your profile picture?</span>
          <div className="buttons">
            <button 
              onClick={()=> {
                deleteProfilePic()
               }}
            >
              delete
            </button>
            <button
              onClick={() => {
                close()
                }
              }
            >
              cancel</button>
          </div>
        </div>
      }
    </>
  )
}