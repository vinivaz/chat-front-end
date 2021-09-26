import React, { useEffect, useState, useCallback, useRef } from 'react';
import ReactDOM from 'react-dom'
import { useSelector, useDispatch } from 'react-redux';


import Cropper from 'react-easy-crop'
import Slider from '@material-ui/core/Slider'
import Button from '@material-ui/core/Button'
import Typography from '@material-ui/core/Typography'
import { withStyles } from '@material-ui/core/styles'
import ImgDialog from './ImgDialog'
import getCroppedImg from './cropImage'
//import { styles } from './styles'
import axios from 'axios';

import { api } from '../../services/api'

import "./styles.css";

const style = (theme) => ({
  cropContainer: {
    position: 'relative',
    width: '100%',
    height: 200,
    background: '#333',
    [theme.breakpoints.up('sm')]: {
      height: 400,
    },
  },
  cropButton: {
    flexShrink: 0,
    marginLeft: 16,
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

function EditProfile({classes, fileData}){
  const data = useSelector(state => state.edit_profile_pic);

  const [crop, setCrop] = useState({ x: 0, y: 0 })
  //const [rotation, setRotation] = useState(0)
  const [zoom, setZoom] = useState(1)
  const [croppedAreaPixels, setCroppedAreaPixels] = useState(null)
  const [croppedImage, setCroppedImage] = useState(null)

  const [imgSrc, setImgSrc] = useState(null)

  const [ open, setOpen ] = useState(false);

  
  const onCropComplete = useCallback((croppedArea, croppedAreaPixels) => {
    setCroppedAreaPixels(croppedAreaPixels)
  }, [])

  const onClose = useCallback(() => {
    
    setCroppedImage(null)
    setImgSrc(null)
    setOpen(false)
  }, [])

  useEffect(() => {
    setOpen(data.open)

    if(open ===true){

      console.log(imgSrc, "abubleh")
      
    }  
    
  },[data])

  
    // will hold a reference for our real input file
    let inputFile = '';
  
    // function to trigger our input file click
    const uploadClick = e => {
      e.preventDefault();
      inputFile.click();
      return false;
    };

  async function esperar(){
    const abuble = await readFile(data.file_data)
    setImgSrc(abuble)
  }

  function readFile(file) {
    return new Promise((resolve) => {
      const reader = new FileReader()
      reader.addEventListener('load', () => resolve(reader.result), false)
      reader.readAsDataURL(file)
    })
  }

  const showCroppedImage = useCallback(async () => {
    try {
      const croppedImage = await getCroppedImg(
        imgSrc,
        croppedAreaPixels,
        //rotation
      )
      console.log('donee', { croppedImage })
      
      setCroppedImage(URL.createObjectURL(croppedImage))

      file(croppedImage)
    } catch (e) {
      console.error(e)
    }
  }, [croppedAreaPixels/* rotation*/])

  async function file(blob){
    const newFile = new File([blob], "teste.jpeg", {type: 'image/jpeg'});
    
    var formData = new FormData();
    formData.append("file", newFile);

    const send = await api.post('/user/profile/edit', formData, {headers: {"Content-Type": `multipart/form-data; boundary=${formData._boundary}`}})
    console.log(send, 'mdsss arrr')

    console.log(newFile, "newfilefdfsdfdsf")
    //setTest(newFile)
    
  }

  const onFileChange = async (e) => {
    if (e.target.files && e.target.files.length > 0) {
      console.log(e)
      const file = e.target.files[0]
      let imageDataUrl = await readFile(file)
      setImgSrc(imageDataUrl)
    }
  }

  const ref = useRef(null)
  
  return(<div onClick={()=>onClose()}className="edit-profile" style={{display:open? "block": "none"}}>
    <h1>testee</h1>
    {imgSrc ? 
      (<>
        <div className={classes.cropContainer}>
          <Cropper
            image={imgSrc}
            crop={crop}
          // rotation={rotation}
            zoom={zoom}
            aspect={1}
            onCropChange={setCrop}
            //onRotationChange={setRotation}
            onCropComplete={onCropComplete}
            onZoomChange={setZoom}
          />
        </div>
        <div className={classes.controls}>
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
            onClick={showCroppedImage}
            variant="contained"
            color="primary"
            classes={{ root: classes.cropButton }}
          >
            Show Result
          </Button>
        </div>
        <ImgDialog img={croppedImage} onClose={onClose} />
      </>)
    :
      (<input
        type="file"
        onLoad={uploadClick}
        onChange={(e) => onFileChange(e)}
        name="fileUpload"
        ref={input => {
        // assigns a reference so we can trigger it later
        inputFile = input;
        }}
      />)
    }

    <h1 onClick={uploadClick}>ahrrrrr</h1>
  </div>)
}

export default withStyles(style)(EditProfile)