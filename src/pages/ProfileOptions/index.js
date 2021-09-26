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
    console.log("profileOptions, close")
    dispatch({type: "UNSET_WINDOW"})
    setUserId(undefined)
  }

  const onFileChange = async (e) => {
    console.log(e)
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

  function showProfilePic(){
    console.log("profileOptions, show profilePc")
    dispatch({type: "SET_WINDOW", data: {open: true, url: props.profileData.profile_img}})
  }

  function deleteProfilePic(){
    api.post(`/user/profile/remove`)
    .then(response => {
      console.log("deu bem a imagem foi apagada, ta aqui o perfil: ", response.data)
      close()
    })
  }

  useEffect(() => {
    if (props.show=== true) {
      console.log("props",props)
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
        <div className="message-window">
          {props.profileData.profile_img !== "" ?
            <div
            className="window-options"
            onClick={() => showProfilePic()}
            >
              <span>See Picture</span>
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
              <span>Change Picture</span>
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
        <div className="message-window">
          <span id="close" onClick={() => close()} className="close">&times;</span>
          <span>Delete you profile picture?</span>
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