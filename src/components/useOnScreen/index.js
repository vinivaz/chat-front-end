import { useEffect, useState } from 'react';

export default function useOnScreen(ref, rootMargin = '0px'){

  const [ isVisible, setIsVisible ] = useState(false)

  useEffect(() => {

    console.log(ref.current)

    if(ref.current === null)return;

    const observer = new IntersectionObserver(
      ([entry]) => setIsVisible(entry.isIntersecting), { rootMargin }
    )

    observer.observe(ref.current)

    return () =>{
      if(ref.current === null) return;
      observer.unobserve(ref.current)

    }

  }, [ref.current, rootMargin])

  return isVisible
}




/*

  (experimental) [visible, setVisible ] = useState(false)

  const visible = useOnScreen(ref, "-50px")

  <
    ref={ref}
  >
  {visible&&'(visible)'}
  </>

*/