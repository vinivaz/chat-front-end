import React, { useState, useCallback } from 'react'
import ReactDOM from 'react-dom'
import Cropper from 'react-easy-crop'
import Slider from '@material-ui/core/Slider'
import Button from '@material-ui/core/Button'
import Typography from '@material-ui/core/Typography'
import { withStyles } from '@material-ui/core/styles'
import ImgDialog from './ImgDialog'
import getCroppedImg from './cropImage'
import { styles } from './styles'
import axios from 'axios';


const api = axios.create({
  baseURL: 'http://localhost:3000/api'
});

api.interceptors.request.use(config => {
  config.headers.Authorization = 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjYwZjc2MDQwOWU1ZDQxMjQ2OGJlMmM2YSIsImlhdCI6MTYyODY3NTg3NywiZXhwIjoxNjI4NzYyMjc3fQ.ETNhR7J6zgkUiYBH0sMBWQCEUx5BHY_arFeR1k-b0RY'
  return config;
});


const Demo = ({ classes }) => {
  const [crop, setCrop] = useState({ x: 0, y: 0 })
  //const [rotation, setRotation] = useState(0)
  const [zoom, setZoom] = useState(1)
  const [croppedAreaPixels, setCroppedAreaPixels] = useState(null)
  const [croppedImage, setCroppedImage] = useState(null)
  const [imgSrc, setImgSrc] = useState(null)

  const [test, setTest ] = useState(null)

  const onCropComplete = useCallback((croppedArea, croppedAreaPixels) => {
    setCroppedAreaPixels(croppedAreaPixels)
  }, [])

  async function file(blob){
    const newFile = new File([blob], "teste.jpeg", {type: 'image/jpeg'});
    
    var formData = new FormData();
    formData.append("file", newFile);

    const send = await api.post('/user/profile/edit', formData, {headers: {"Content-Type": `multipart/form-data; boundary=${formData._boundary}`}})
    console.log(send, 'mdsss arrr')

    console.log(newFile, "newfilefdfsdfdsf")
    setTest(newFile)
    
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

  const onClose = useCallback(() => {
    
    setCroppedImage(null)
    setImgSrc(null)
  }, [])

  function readFile(file) {
    return new Promise((resolve) => {
      const reader = new FileReader()
      reader.addEventListener('load', () => resolve(reader.result), false)
      reader.readAsDataURL(file)
    })
  }


  const onFileChange = async (e) => {
    if (e.target.files && e.target.files.length > 0) {
      console.log(e)
      const file = e.target.files[0]
      let imageDataUrl = await readFile(file)
      setImgSrc(imageDataUrl)
    }
  }
  return (
    <div>{imgSrc ? 
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
        {test&&<img src={test.name} alt="fodac"/>}
      </>)
    :
      (<input type="file" onChange={(e) => onFileChange(e)}/>)
    }
    <button id="download">baixar</button>
    </div>
  )
}

const EditProfile = withStyles(styles)(Demo)

export default EditProfile


/**<div className={classes.sliderContainer}>
          <Typography
            variant="overline"
            classes={{ root: classes.sliderLabel }}
          >
            Rotation
          </Typography>
          <Slider
            value={rotation}
            min={0}
            max={360}
            step={1}
            aria-labelledby="Rotation"
            classes={{ root: classes.slider }}
            onChange={(e, rotation) => setRotation(rotation)}
          />
        </div> */
