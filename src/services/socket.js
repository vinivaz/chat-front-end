import io from 'socket.io-client';
let socket;

export const testeIniciateSocket = (profileId) => {
  socket = io('http://localhost:3000');
  console.log(`ta iniciando o socket1`);
  console.log(profileId);
  if (socket && profileId) socket.emit('online-profile', profileId);
}


export const initiateSocket = (room) => {
  //socket = io('http://localhost:3000');
  //console.log(`Connecting socket...`);
  if (socket && room) socket.emit('join-room', room);
}

export const switchRooms = (prevRoom, nextRoom) => {
  console.log('rtessssteeee')
  if (socket) socket.emit('switch', { prevRoom, nextRoom });
}

export const disconnectSocket = () => {
  console.log('Disconnecting socket...');
  if(socket) socket.disconnect();
}

export const getOnlineUsers = (cb) => {
  if (!socket) return(true);
  socket.on('online-users', usersIds => {
    
    return cb(null, usersIds);
  });
}

export const subscribeToChat = (cb) => {
  if (!socket) return(true);
  socket.on('receive-msg', msg => {
    console.log('Websocket event received!');
    return cb(null, msg);
  });
}

export const onOtherUserTyping = (cb) => {
  if (!socket) return(true);
  socket.on('typing-feedback',(userId, value) => {
    console.log('Websocket event received!');
    return cb(null, userId, value);
  });
}

export const setUserTyping = (user, value, room) => {
  if (socket) socket.emit('typing-event', {user, value, room});

  
}

export const onRequestToDeleteChatRoom = (cb) => {
  if (!socket) return(true);
  socket.on('destroy-history', msg => {
    console.log('delete all messages!');
    return cb(null, msg);
  });
}

export const newRoomList = (cb) => {
  if (!socket) return(true);
  socket.on('update-room-list', updatedRoom => {
    console.log('tenho q atualizar a lista de salas');
    return cb(null, updatedRoom);
  });
}

export const onRequestToDeleteRoom = (cb) => {
  if (!socket) return(true);
  socket.on('remove-room', updatedRoom => {
    console.log('recarregar lista  de salas');
    return cb(null, updatedRoom);
  });
}

export const removeRoom = (roomData, otherUser) => {
  if (socket) socket.emit('delete-chat-history', roomData, otherUser);
}

export const sendMsg = (roomData, newMsg) => {
  if (socket) socket.emit('send-msg', roomData, newMsg);

  
}

export const onMessageDeleted = (cb) => {
  if (!socket) return(true);
  socket.on('remove-msg', (msgId) => {
    console.log('Websocket event received!');
    return cb(null, msgId);
  });
}

export const deleteMsg = (room, msgId) => {
  if (socket) socket.emit('delete-msg', room, msgId);

}

export const newerMessage = (cb) => {
  if (!socket) return(true)
  socket.on('receive-msg', newMsg => {
    console.log(socket)
    return cb(null, newMsg);
  
  })
}