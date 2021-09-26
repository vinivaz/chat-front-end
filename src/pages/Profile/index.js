import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';

import ImprovisedProfilePic from "../ImprovisedProfilePic"
import { api } from '../../services/api'

import "./styles.css";

export default function Profile(){

  const loggedProfile = useSelector(state => state.profile);

  const otherProfileId = useSelector(state => state.other_profile_id);

  const currentContent = useSelector(state => state.current_content);

  const [profileData, setProfileData ] = useState();

  const dispatch = useDispatch()

  useEffect(() =>{
    if(currentContent.profile){
      if(otherProfileId === loggedProfile._id){
        setProfileData(loggedProfile)
      } else {
        getAnotherProfile(otherProfileId)
      }
    }
  },[currentContent])

  function getAnotherProfile(otherProfileId){
    api.get(`/user/profile/find/${otherProfileId}`)
    .then(response => {
      setProfileData(response.data)
    })
  }

  function ProfileOptions(profile){
    dispatch({
      type: 'SET_WINDOW',
      data: {
        open: true,
        profile_data: profile
      }
    })
  }

  return(
    
    <div className="profile-component">
      {profileData&&
        <div className="content">
          <div className="profile-data">
            <div className="profile-pic" onClick={() => ProfileOptions(profileData)}>
              {profileData.profile_img !== "" ?
                <img src={`http://${profileData.profile_img}`} width="100" height="100" alt={`a profile pic of ${profileData.name}`}/>
              :
                <ImprovisedProfilePic user={profileData} width={100} height={100} circle={true}/>
              }
            </div>
            <div className="profile-name">
              <span>{profileData.name}</span>
            </div>
            <div className="profile-email">
              <span>{profileData.email}</span>
            </div>
          </div>
          <div className="profile-details">

          </div>
        </div>
      }
    </div>
  )
}