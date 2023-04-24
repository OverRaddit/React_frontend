import io from 'socket.io-client';

const initSocket = (sessionToken) => {
  const socket = io('http://localhost:4242/chat', {
    extraHeaders: {
      Authorization: `Bearer ${sessionToken}`,
    },
  });

  socket.on('connect', () => {
    console.log('Connected');
  });

  socket.on('disconnect', () => {
    console.log('Disconnected');
  });

  socket.intraID = 'gshim';
  socket.userId = 1;

  // socket에 사용자의 metaData를 넣어줘야 할 것 같습니다.
  // ex) User의 db id, nickname

  return socket;
}

export default initSocket;
