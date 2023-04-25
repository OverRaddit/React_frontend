import React, { useState, useRef, useEffect } from 'react';
import './XPage.css'
import { CreateChannelForm } from 'components/chat/createChannelForm';
import initSocket from 'socket';
import { ChannelLookup } from 'components/chat/ChannelLookUp';

/*
ㅇㅣ제 모든 소켓은, 이 컴포넌트에서 관리합니다!

발생할 수 있는 문제점은 다음과 같다.
- XPage라는 컴포넌트가 다시 렌더링되면, 소켓이 끊겼다가 다시 연결됩니다.
  - 소켓과 관련된 이벤트리스너가 다시 추가되고, 새로 렌더링될때마다 이벤트리스너가 늘어납니다.
    - 서버에서 보내는 단일 이벤트에 대해 여러 이벤트핸들러가 동작하게 됩니다.
    -> 이벤트리스너가 계속 추가되는 것은 useEffect의 반환부에서 취소함으로써 해결할 수 있습니다.

내가 알아봐야 할 것.
- 일반적으로 SocketIO client에서 socket을 어디에 선언해두어야 합니까?
- 근데 가만 생각해보니,,,, 전역에서 한번만 선언하면 되는거 아닌가?
- 전역이면 외부파일에서 동작시키고 import하는 것만으로 충분할 것 같은데???!
*/

const sampleChannelData = [
  {
    kind: 0,
    roomname: 'Public Room 1',
    owner: 'Alice',
    roompassword: '',
  },
  {
    kind: 1,
    roomname: 'Password Protected Room',
    owner: 'Bob',
    roompassword: 'password',
  },
  {
    kind: 0,
    roomname: 'Public Room 2',
    owner: 'Charlie',
    roompassword: '',
  },
];

const exampleChatHistory = [
  'Hello, how are you?',
  'I am doing well, thanks for asking.',
  'What have you been up to lately?',
  'Not much, just working on some coding projects.',
];

const XPage = () => {
  const [chatHistory, setChatHistory] = useState(exampleChatHistory);
  const [currentChat, setCurrentChat] = useState('');
  const [currentChatRoom, setCurrentChatRoom] = useState('gshimRoom');

  const [socket, setSocket] = useState(null);
  const [chatRooms, setChatRooms] = useState(sampleChannelData);
  const chatHistoryRef = useRef(null); // new2

  useEffect(() => {
    const sessionToken = 'add_session_here';
    const newSocket = initSocket(sessionToken);
    setSocket(newSocket);

    return () => {
      newSocket.disconnect();
      setSocket(null);
    };
  }, []);

  useEffect(() => {
    if (!socket) return;
    socket.on('getChannel', (channels) => {
      console.log('getChannel: ', channels);
      setChatRooms(channels);
    });

    socket.on('welcome', (data) => {
      const { num, roomName } = data;
      console.log(`someone join ${roomName}(${num})`);
      if (roomName === currentChatRoom)
        setChatHistory([...chatHistory, 'someone join the chatRoom!']);
      console.log('someone join the chatRoom');
      console.log(`현재 방에 들어와 있던 인원은 ${num}명입니다`);
    });

    /*
    data = {
      "message": "hello world!",
      "roomName": ""
    }
    */
    socket.on('chat', (data) => {
      const { message, roomName } = data;
      console.log('detect chat event: ', data);

      console.log('currentChatRoom: ', currentChatRoom);
      console.log('roomName: ', roomName);

      // 현재 켜놓고 있는 채널의 chat만 저장합니다.
      if (currentChatRoom === roomName)
        setChatHistory([...chatHistory, message]);
      else
        console.log('this room is not opened from my client!');
    })

    // socket.on('joinChannel'), (data) => {

    // });

    // 왜 여기는 이벤트를 해제하는 리턴 함수를 쓰지 않았지?
    return (() => {
      socket.off('getChannel');
      socket.off('welcome');
      socket.off('chat');
      //socket.off('joinChannel');
  });
  }, [socket, chatHistory, currentChatRoom, currentChat]);

  useEffect(() => {
    const chatHistoryBox = chatHistoryRef.current;
    const gap = chatHistoryBox.scrollHeight - chatHistoryBox.scrollTop
    console.log('gap: ', gap);
    if (gap < 230)
      chatHistoryBox.scrollTop = chatHistoryBox.scrollHeight;
  }, [chatHistory]);

  const onCreateChannel = (data) => {
    console.log('data: ', data);
    console.log('send onCreateChannel event')
    socket.emit('createChannel', data);
  };

  const handleChatChange = (e) => {
    setCurrentChat(e.target.value);
  };

  const handleChatSubmit = (e) => {
    e.preventDefault();
    if (currentChat.trim() !== '') {
      setChatHistory([...chatHistory, 'You: ' + currentChat]);

      /*
      data = {
        "message": "hello world!",
        "roomName": ""
      }
      */
      socket.emit('chat', { roomName: currentChatRoom, message: currentChat});
      setCurrentChat('');
    }
  };

  // data = {
  //   "kind": 0,
  //   "roomName": "sample room name",
  //   "roomPassword": "sample room name", <- optional property
  // }
  const handleChatRoomSubmit = (e) => {
    e.preventDefault();

    // 룸 생성 옵션
    const kind = 0;
    const roomName = 'default_name';
    const roomPassword = undefined;

    if (roomName.trim() !== '') {
      //socket.emit('createChannel', { kind, roomName, roomPassword });
      setCurrentChat('');
    }
  };

  // socket.on('createChannel', (roomName) => {
  //   console.log(`채팅방[${roomName}]을 생성합니다..`);
  //   socket.emit('')
  // });

  // onChatSubmit={handleChatSubmit} onChatChange={handleChatChange}


  return (
    <div className="x-page">
      <h1>XPage Component</h1>
      <div className="x-page-top">
        <button>Normal Button</button>
        <button>Expand Button</button>
      </div>
      <div className="x-page-bottom">
        <div
          className="chat-history-box"
          ref={chatHistoryRef}
          // onScroll={handleScroll}
        >
          <ul>
            {chatHistory.map((chat, index) => (
              <li key={index}>{chat}</li>
            ))}
          </ul>
        </div>
        <form onSubmit={handleChatSubmit}>
          <input
            className='chat-input-box'
            type="text"
            value={currentChat}
            onChange={handleChatChange}
            placeholder="Type your chat here"
          />
          <button type="submit">Send</button>
        </form>

        { true ?
          <>
            <h3>Make your own</h3>
            <CreateChannelForm setChatHistory={setChatHistory} setCurrentChatRoom={setCurrentChatRoom} onCreateChannel={onCreateChannel}/>
          </>
          : <h3>you can't make room now!</h3>
        }

        <ChannelLookup setChatHistory={setChatHistory} setCurrentChatRoom={setCurrentChatRoom} socket={socket} chatRooms={chatRooms}/>
      </div>
    </div>
  );
};

export default XPage;
