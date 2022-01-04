import React, { useState, useEffect } from 'react';
import useEventListener from '../useEventListener';


export default function useWindowSize(){
  const [windowSize, setWindowSize] = useState({
    width: window.innerWidth,
    height: window.innerHeight
  })

  useEventListener('resize', () => {
    setWindowSize({  width: window.innerWidth,
      height: window.innerHeight })
  })

  return windowSize
}


function useSizeDimensions() {
  const [ dimentions, setDimentions ] = useState({
    width: window.innerWidth,
    height: window.innerHeight
  })


  useEffect(() =>{
    window.addEventListener('resize', () =>{
      setDimentions({
        width: window.innerWidth,
        height: window.innerHeight
      })
    });
    //setA(document.getElementById('m').style.display)
    
    return () => {
       window.removeEventListener('resize', () =>{
         setDimentions({
        width: window.innerWidth,
        height: window.innerHeight
      })
       });
    }
  },[]);

  

  //const { width, height } = useWindowSize()
  //

  // useEffect(() => {
  //   function handleResize() {
  //     setWindowDimensions(getWindowDimensions());
  //   }
  //   console.log(getWindowDimensions())
  //   window.addEventListener('resize', handleResize);
  //   return () => window.removeEventListener('resize', handleResize);
  // }, []);

  return dimentions;
}