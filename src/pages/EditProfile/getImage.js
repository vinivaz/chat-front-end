export default function getImage() {
  const onFileChange = async (e) => {
    if (e.target.files && e.target.files.length > 0) {
      console.log(e)
      const file = e.target.files[0]
      /*let imageDataUrl = await readFile(file)

      // apply rotation if needed
      const orientation = await getOrientation(file)
      const rotation = ORIENTATION_TO_ANGLE[orientation]
      if (rotation) {
        imageDataUrl = await getRotatedImage(imageDataUrl, rotation)
      }

      setImageSrc(imageDataUrl)*/
    }
  }

  return (
    <div>
      <input type="file" style="background-color: red;" onClick={() => onFileChange()}>toma que de certo</input>
    </div>
  )
}