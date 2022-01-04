import React, { useState, useLayoutEffect, useEffect, useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';

import { api } from '../../services/api'
import { newRoomList, testeIniciateSocket, disconnectSocket, onRequestToDeleteRoom, getOnlineUsers } from '../../services/socket'

import RoomInfo from '../RoomInfo'

import Loading from '../Loading'
import Loading2 from '../Loading2'
import  io  from "socket.io-client";
import './styles.css';

export default function Rooms(){
  const profileId = useSelector(state => state.profile._id);
  const onlineUsers = useSelector(state => state.online_users)
  const activeItem = useSelector(state => state.room.room_id);
  const dispatch = useDispatch();
  const [ newData, setNewData ] = useState(null)
  const [rooms, setRooms] = useState([]);
  const [freshRooms, setFreshRooms] = useState([]);
  const [ page, setPage ] = useState(1);
  const [ pages, setPages ] = useState(1);
  const [ isLoading, setIsLoading ] = useState(false);
  const [ roomsSeen, setRoomsSeen ] = useState(false);
  const [ timer, setTimer ] = useState(null);
  const ref = useRef(null);
  
  

  useEffect(() => {
    getRooms()
    
  },[])

  useEffect(() => {

    //It causes the sidebar to show when there's new messages at each 7 minutes 
    if(roomsSeen===true){
      setTimer(
        setTimeout(
          () => { setRoomsSeen(false)},
          700000
        )
      );
    }
    
  },[roomsSeen])

  useEffect(() => {
    testeIniciateSocket(profileId)
    console.log('teste inciantingf')

    
    return () => { 
      disconnectSocket()
    }
  },[profileId])

  useEffect(() => {
    newRoomList((err, data) => {
      console.log('newRoomData', data)
      if(err) console.log('arrrr nta dandp ccertoooo');
      console.log(data)
      setNewData(data)
      //updateRoomList(data);
    });
  },[profileId])

  useEffect(() => {
    if(newData !== null){
      console.log(newData, "newRoomData")
      updateRoomList(newData)
      setNewData(null)
    }
    console.log("newRoomData")
  },[newData])
  

  useEffect(() => {
    onRequestToDeleteRoom((err, data) => {
      console.log('newRoomData', data)
      if(err) console.log('arrrr nta dandp ccertoooo');
      console.log(data)
      
      removeRoom(data);
    });
  },[profileId])

  useEffect(() => {
    getOnlineUsers((err, data) => {
      
      if(err) console.log('arrrr nta dandp ccertoooo');
      
      dispatch({type: 'SET_ONLINE_USERS', data:data})
    });
  },[profileId])

  

  // useEffect(() => {
  //   //const socket = io.connect('http://localhost:3000');
  //   /*
  //   As soon as the user gets logged in, he's going to be joining to a room named
  //   with his own Id, everytime a user send a new message, a new request is done 
  //   for every Id room that is in the room
  //   */
  //   // socket.emit('join-room', profileId);
    
  //   // socket.on('update-room-list', (updatedRoom) => {
  //   //   if(roomsSeen===false){
  //   //     dispatch({type: "SHRINK_SIDEBAR"});
  //   //     setRoomsSeen(true);
  //   //   }
  //   //   updateRoomList(updatedRoom);
  //   // })

  //   // //
  //   // socket.on('remove-room',(roomId) => {
    
  //   //   removeRoom(roomId);
  //   // })

  //   return () => { 
  //     //socket.emit('leave-room', profileId);
  //   }
  // })
  
  /*
    tries to find a room inside the list, from room and freshRooms (both array of object),
    and delete, then it adds the same room to the freshRooms, now with new info, at the top of the 
    list 
  */
  function updateRoomList(updatedRoom){

    console.log(rooms)
    let delFromRooms = rooms.findIndex(x => x._id === updatedRoom._id);
    
    if(delFromRooms === -1){
      console.log(delFromRooms)
      let delFromFreshRooms = freshRooms.findIndex(x => x._id === updatedRoom._id);
      console.log(delFromFreshRooms)
      
      if(delFromFreshRooms !== -1){
        var newFreshRooms = freshRooms;
        newFreshRooms.splice(delFromFreshRooms,1);
        setFreshRooms();
        setFreshRooms([...newFreshRooms, ...[updatedRoom]]);
      }else{
        let savedFreshRooms = freshRooms;
        setFreshRooms([]);
        setFreshRooms([...savedFreshRooms,...[updatedRoom]]);
      }
      
    }else{
      let newRooms = rooms;
      let newFreshRooms = freshRooms;
      newRooms.splice(delFromRooms,1);
      setRooms();
      setRooms([...newRooms]);
      setFreshRooms();
      setFreshRooms([...newFreshRooms,...[updatedRoom]]);
    }
  }

  function removeRoom(){
    setFreshRooms([]);
    setPage(1);
    getRooms();
  }

  function getRooms(){
    api.get('/user/rooms?page=1')
    .then((response) => {
      setRooms(response.data.room.docs);
      console.log(response.data.room.docs)
      setPages(response.data.room.pages)
      
    })
    .catch(function (error){
      console.log(error);
    })
  }

  //Search for new room when scrolled to end of the scrollbar
  function getMoreRooms(e){
    const { scrollTop, clientHeight, scrollHeight } = e.currentTarget;

    const scrollBarPercenage = ((scrollTop/(scrollHeight - clientHeight))*100)

    if(scrollBarPercenage >= 97){

      if(pages > page){
        setIsLoading(true)
        api.get(`/user/rooms?page=${page + 1}`)
        .then((response) => {
          console.log(response.data.room.docs)
          setIsLoading(false)
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
              console.log('fez a requisição na seguinte pagina:', varPage)
              console.log(response.data)
              console.log('ta pelo menos fazendo a requisição', [...varRoom, ...response.data.room.docs])
              varRoom = [...varRoom, ...response.data.room.docs];
              console.log("varRoom",varRoom)
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
      onLoad={() => noScrollbarHandler()}
      onScroll={(e) => getMoreRooms(e)}
      ref={ref}
    > 
      <div
        className="fresh-rooms"
      >
        {freshRooms&&freshRooms.map(freshRoom =>
          <div className={activeItem === freshRoom._id ? "room-item-active": "room-item"} key={freshRoom._id}>
          {
          freshRoom.name !== undefined ?
            freshRoom.name 
          :
            <RoomInfo
              roomData={freshRoom}
              roomId={freshRoom._id}
              users={freshRoom.users}
              lastMessage={freshRoom.lastMessage}
            />
          }
          </div>
        )}
      </div>
      {((rooms)!== undefined)&&rooms.map(room =>
        <div className={activeItem === room._id ? "room-item-active": "room-item"} key={room._id}>
          {
          room.name !== undefined ?
            room.name :
            <RoomInfo
              roomData={room}
              roomId={room._id}
              users={room.users}
              lastMessage={room.lastMessage}
            />
          }
        </div>
        
      )}
      {isLoading=== true ? 
        <div className="load">
          <div className="loading-container" >
            <Loading2/>
          </div>
        </div>
      :
        ""
      }
    </div> 
  )
}

// function removeRoom(roomId){
    
    // let removeFromRooms = rooms.findIndex(x => x._id === roomId);
    
    // if(removeFromRooms === -1){
    //   let removeFromFreshRooms = freshRooms.findIndex(x => x._id === roomId);
    //   if(removeFromFreshRooms !== -1){

    //     var newFreshRooms = freshRooms;
    //     newFreshRooms.splice(removeFromFreshRooms,1)
    //     setFreshRooms([...newFreshRooms])

    //     const { clientHeight, scrollHeight } = ref.current
    //     if(((clientHeight - scrollHeight) === 1)|| clientHeight === scrollHeight){
    //     noScrollbarHandler()
    //     }
    //   }else{
    //     return
    //   }
    // }else{
    //   var newRooms = rooms;
    //   newRooms.splice(removeFromRooms,1)
    //   setRooms([...newRooms])

    //   const { clientHeight, scrollHeight } = ref.current
    //   if(((clientHeight - scrollHeight) === 1)|| clientHeight === scrollHeight){
    //     noScrollbarHandler()
    //   }
    // }
  // }