import React, {useEffect, useState } from 'react';

export default function ImgHandler({
    src,
    height = undefined,
    width = undefined,
    imgClass = undefined,
    children, test
  }){

  const [error, setError] = useState(false);

  useEffect(()=>{
    if(src === ""){
      setError(true)
    }else{
      setError(false)
    }  
    
  },[src])

  return(
    <>
    {error=== false?
      <img
        src={src}
        height={height}
        width={width}
        className={imgClass}
        alt='.'
        onClick={test}
        onError={() => {
          setError(true)
          
        }}
      />
    : 
      <>
      {children}
      </>
    }
    </>
  )
}