import React, { useEffect, useState, useCallback } from 'react';
import { useSelector, useDispatch } from 'react-redux';

import Cropper from 'react-easy-crop'
import Slider from '@material-ui/core/Slider'
import Button from '@material-ui/core/Button'
import Typography from '@material-ui/core/Typography'
import { withStyles } from '@material-ui/core/styles'
import ImgDialog from './ImgDialog'
import getCroppedImg from './cropImage'

import { api } from '../../services/api'

import "./styles.css";

const style = (theme) => ({
  cropContainer: {
    position: 'relative',
    width: '100%',
    height: 300,
    background: '#333',
    [theme.breakpoints.up('sm')]: {
      height: 500,
    },
  },
  mLButton: {
    flexShrink: 0,
    marginLeft: 16,
  },
  mRButton: {
    flexShrink: 0,
    marginRight: 16,
  },
  controls: {
    padding: 16,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'stretch',
    [theme.breakpoints.up('sm')]: {
      flexDirection: 'row',
      alignItems: 'center',
    },
  },
  sliderContainer: {
    display: 'flex',
    flex: '1',
    alignItems: 'center',
  },
  sliderLabel: {
    [theme.breakpoints.down('xs')]: {
      minWidth: 65,
    },
  },
  slider: {
    padding: '22px 0px',
    marginLeft: 32,
    [theme.breakpoints.up('sm')]: {
      flexDirection: 'row',
      alignItems: 'center',
      margin: '0 16px',
    },
  },
})

function EditProfile({classes}){
  const data = useSelector(state => state.edit_profile_pic);

  const [crop, setCrop] = useState({ x: 0, y: 0 })
  //const [rotation, setRotation] = useState(0)
  const [zoom, setZoom] = useState(1)
  const [croppedAreaPixels, setCroppedAreaPixels] = useState(null)
  const [croppedImage, setCroppedImage] = useState(null)

  const [imgUrl, setImgUrl] = useState(null)

  const [ open, setOpen ] = useState(false);

  const dispatch = useDispatch()
  
  const onCropComplete = useCallback((croppedArea, croppedAreaPixels) => {
    setCroppedAreaPixels(croppedAreaPixels)
  }, [])

  const onClose = useCallback(() => {
    
    setCroppedImage(null)
    setImgUrl(null)
    setOpen(false)
    dispatch({
      type: "SET_PROFILE_PIC",
      data: {
        open: false,
        url_data: undefined
      }
    })
  }, [])

  const openImage = useCallback(async () => {
    
    try {
      const croppedImage = await getCroppedImg(
        imgUrl,
        croppedAreaPixels,
        //rotation
      )
      
      
      //setCroppedImage(URL.createObjectURL(croppedImage))
      dispatch({type: "SET_WINDOW", data: {open: true, url: URL.createObjectURL(croppedImage)}})
    } catch (e) {
      console.error(e)
    }
    
}, [croppedAreaPixels])


  useEffect(() => {

    if(data.open ===true){
      setOpen(data.open)
      setImgUrl(data.url_data)
      
      
    }else{
      setOpen(false)
      setImgUrl(null)
    }
    
  },[data])

  const showCroppedImage = useCallback(async () => {
    try {
      const croppedImage = await getCroppedImg(
        imgUrl,
        croppedAreaPixels,
        //rotation
      )
      
      
      //setCroppedImage(URL.createObjectURL(croppedImage))
      
      file(croppedImage)
      onClose()
    } catch (e) {
      console.error(e)
    }
  }, [croppedAreaPixels])

  async function file(blob){
    const newFile = new File([blob], "teste.jpeg", {type: 'image/jpeg'});
    
    var formData = new FormData();
    formData.append("file", newFile);

    const send = await api.post('/user/profile/edit', formData, {headers: {"Content-Type": `multipart/form-data; boundary=${formData._boundary}`}})
    
    if(send.data.error) return;
    dispatch({type: 'SET_PROFILE', data: send.data})

    
    //setTest(newFile)
    
  }
  
  return(<div className="edit-profile" style={{display:open? "block": "none"}}>
    {imgUrl=== undefined ? "": (<>
        <div className={classes.cropContainer}>
          <Cropper
            image={imgUrl}
            crop={crop}
            zoom={zoom}
            aspect={1}
            onCropChange={setCrop}
            onCropComplete={onCropComplete}
            onZoomChange={setZoom}
          />
        </div>
        
        <div className={classes.controls}>
          <Button
            onClick={showCroppedImage}
            variant="contained"
            color={'primary'}
            classes={{ root: classes.mRButton }}
          >
            Confirm
          </Button>
          <Button
            onClick={openImage}
            variant="contained"
            color={'primary'}
            classes={{ root: classes.mRButton }}
          >
            Show Result
          </Button>
          <div className={classes.sliderContainer}>
            <Typography
              variant="overline"
              classes={{ root: classes.sliderLabel }}
            >
              Zoom
            </Typography>
            <Slider
              value={zoom}
              min={1}
              max={3}
              step={0.1}
              aria-labelledby="Zoom"
              classes={{ root: classes.slider }}
              onChange={(e, zoom) => setZoom(zoom)}
            />
            
          </div>
          <Button
            onClick={()=>onClose()}
            variant="contained"
            color={'secondary'}
            classes={{ root: classes.mLButton }}
          >
            Cancel
          </Button>
        </div>
        <ImgDialog img={croppedImage} onClose={onClose} />
      </>)}
  </div>)
}

export default withStyles(style)(EditProfile)