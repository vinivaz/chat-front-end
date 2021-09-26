import React, { useState, useLayoutEffect, useEffect, useRef } from 'react';
import { useSelector } from 'react-redux';

import { api } from '../../services/api'

import RoomInfo from '../RoomInfo'
import './styles.css';

export default function Rooms(){
  const [rooms, setRooms] = useState([]);
  const [ page, setPage ] = useState(1);
  const [ pages, setPages ] = useState(1);
  
  const activeItem = useSelector(state => state.room.room_id)
  const room = useSelector(state => state.room)

  const ref = useRef(null);
  

  const [ test, setTest ] = useState({
    scrollTop: '',
    clientHeight: '',
    scrollHeight: '',
    scrollH_scrollT: '',
    porcentagem: ''
  });

  useLayoutEffect(() => {
    getRooms()
    
  },[])

  useEffect(() =>{
    //console.log(test)
    
  }, [test]);
 

  useEffect(() =>{
    console.log(ref)

    
  }, [ref]);


  function getRooms(){
    api.get('/user/rooms?page=1')
    .then((response) => {
      setRooms(response.data.room.docs);
      setPages(response.data.room.pages)
    })/*console.log(response.data.room.docs)setRooms(response.data.room.docs))*/
    .catch(function (error){
      console.log(error);
    })
  }

  function getMoreRooms(e){
    const { scrollTop, clientHeight, scrollHeight } = e.currentTarget;

    const scrollBarPercenage = ((scrollTop/(scrollHeight - clientHeight))*100)
    
    console.log("ainda tem mais paginass?", pages > page)
    console.log("pages: ", pages)
    console.log("page: ", page)

    if(scrollBarPercenage >= 97){

      if(pages > page){
        console.log("atualixar")
        api.get(`/user/rooms?page=${page + 1}`)
        .then((response) => {
          console.log(response.data.room.docs)
          setRooms([...rooms, ...response.data.room.docs]);
          setPage(page + 1)
        })
        .catch(function (error){
          console.log(error);
        })
      }else{
        return
      }
    }else{
      return
    }
  };

  function noScrollbarHandler(){
    var varPage = page
    var varRoom = rooms
    const interv = setInterval(
      () => {
        console.log("tem um setInterval sendo execultado")
        const { clientHeight, scrollHeight } = ref.current

        //guarantee that component keeps loading data when there's no scrollbar
        if(((clientHeight - scrollHeight) === 1)|| clientHeight === scrollHeight){
          if(pages > varPage){

            varPage++
            api.get(`/user/rooms?page=${varPage}`)
            .then((response) => {
              varRoom = [...varRoom, ...response.data.room.docs];
              setRooms(varRoom)
            })
            .catch(function (error){
              console.log(error);
            })
          }else{
            clearInterval(interv)
            setRooms(varRoom)
            setPage(varPage)
          }
        }else{
          clearInterval(interv)
          setRooms(varRoom)
           setPage(varPage)
        }
      }
    ,1500) 
  }
  return(
    <div
    className="chat-history"
    onClick={() => console.log(ref)}
    onLoad={() => noScrollbarHandler()}
    onScroll={(e) => getMoreRooms(e)}
    ref={ref}
    >
      {((rooms)!== undefined)&&rooms.map(room =>
        <div className={activeItem === room._id ? "room-item-active": "room-item"} key={room._id}>
          {
          room.name !== undefined ?
            room.name :
            <RoomInfo roomId={room._id} users={room.users}/>
          }
        </div>
      )}
    </div> 
  )
}