import io from 'socket.io-client';

const initSocket = (url, cookies, setMyData) => {
  //console.log('initSocket] cookies: ', cookies);

  const socket = io(url , {
    extraHeaders: {
      Authorization: `Bearer ${cookies.session_key}`,
      intraId: cookies?.userData?.intraid,
      userId: cookies?.userData?.id,
    },
  });

  socket.on('connect', (response) => {
    setMyData(prevState => ({ ...prevState, socketid: socket }));
    //console.log('Connected~~: ', response);
  });

  socket.on('disconnect', () => {
    //console.log('Disconnected');
  });

  socket.intraID = cookies?.userData?.intraid;
  socket.userId = cookies?.userData?.id;

  //console.log('intarID: ', socket.intraID);
  //console.log('userId: ', socket.userId);


  // socket에 사용자의 metaData를 넣어줘야 할 것 같습니다.
  // ex) User의 db id, nickname

  return socket;
}

export default initSocket;
