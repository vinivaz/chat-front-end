import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';

import ImprovisedProfilePic from "../ImprovisedProfilePic"
import ProfileSettings from "../ProfileSettings"
import { api } from '../../services/api'

import "./styles.css";

export default function Profile(){

  const loggedProfile = useSelector(state => state.profile);

  const otherProfile = useSelector(state => state.other_profile);

  const currentContent = useSelector(state => state.current_content);

  const [profileData, setProfileData ] = useState();

  const dispatch = useDispatch()

  useEffect(() =>{
    if(currentContent.profile){
      if(!(otherProfile._id)){
        setProfileData(loggedProfile)
      }else if(otherProfile._id === loggedProfile._id){
        setProfileData(loggedProfile)
        console.log("to executand0")
      } else {

        setProfileData(otherProfile)
        //getAnotherProfile(otherProfileId)
      }


      // if(otherProfile._id === loggedProfile._id){
      //   setProfileData(loggedProfile)
      //   console.log("to executand0")
      // } else {

      //   setProfileData(otherProfile)
      //   //getAnotherProfile(otherProfileId)
      // }
    }
  },[currentContent, loggedProfile])

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
                  <img src={`http://${profileData.profile_img}`} alt={`a profile pic of ${profileData.name}`}/>
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
            {profileData._id === loggedProfile._id ?
              <ProfileSettings/>
            :
              ""
            }
            
          </div>
        
      }
      </div>
    
    
  )
}