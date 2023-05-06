import React, { useState, useRef, useEffect } from 'react';
import './XPage.css'
import { CreateChannelForm } from 'components/chat/createChannelForm';
import initSocket from 'socket';
import { ChannelLookup } from 'components/chat/ChannelLookUp';
import { Link } from 'react-router-dom';
import { useMyContext } from 'MyContext';

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

const sampleChannelData2 = new Map([
  [
    'Public Room 1',
    {
      kind: 0,
      roomname: 'Public Room 1',
      owner: 'Alice',
      roompassword: '',
    }
  ],
  [
    'Password Protected Room',
    {
      kind: 1,
      roomname: 'Password Protected Room',
      owner: 'Bob',
      roompassword: 'password',
    },
  ],
  [
    'Public Room 2',
    {
      kind: 0,
      roomname: 'Public Room 2',
      owner: 'Charlie',
      roompassword: '',
    }
  ],
 ]);

 const userChannelList = new Map([]);
//  const userChannelList = new Map([]);

const exampleChatHistory = [
  'Hello, how are you?',
  'I am doing well, thanks for asking.',
  'What have you been up to lately?',
  'Not much, just working on some coding projects.',
];

const parseCookie = (cookie) => {
  const cookies = cookie.split(';');
  const cookieData = {};

  cookies.forEach((cookie) => {
    const [key, value] = cookie.split('=');
    if (key.trim() === 'userData')
    {
      const decodedString = decodeURIComponent(value);
      const javascriptObject = JSON.parse(decodedString);
      console.log('key1: ', key);
      cookieData[key.trim()] = javascriptObject;
    }
    else
    {
      console.log('key2: ', key);
      cookieData[key.trim()] = value;
    }
  });

  return cookieData;
}

const XPage = () => {
  const [currentChatHistory, setChatHistory] = useState(['']);
  const [currentChat, setCurrentChat] = useState('');
  const [socket, setSocket] = useState(null);
  const [chatRooms, setChatRooms] = useState(sampleChannelData);
  const [userChatRooms, setUserChatRooms] = useState(userChannelList);
  const [currentChatRoom, setCurrentChatRoom] = useState('gshimRoom');  // 현재 선택된 채널의 이름을 저장한다.
  const { myData, setMyData, friends, setFriends } = useMyContext();

  const [isModalOpen, setIsModalOpen] = useState(true);
  const [modalMessage, setModalMessage] = useState('');

  const chatHistoryRef = useRef(null); // new2

  useEffect(() => {
		// userChannelList.set('channelName',
		// {
		// kind: 0,
		// roomname: 'testRoom',
		// owner: 'yson',
		// chatHistory : [],
		// });
    const cookies = parseCookie(document.cookie);
    console.log('Xpage cookies: ', cookies);

    const newSocket = initSocket('http://localhost:4242/chat', cookies, setMyData);
    console.log('newSocket: ', newSocket);
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

      // 이 부분을 바꿔야 한다...
      // 이건 사용자가 참여한 채널목록이 아니다.
      // 채널 조회를 통해 받아온 채널목록일 뿐이다.
      // channel를 순회하며
      setChatRooms(channels);
    });

    socket.on('welcome', (data) => {
      const { num, roomName } = data;
      console.log(`someone join ${roomName}(${num})`);
      if (roomName === currentChatRoom)
        setChatHistory([...currentChatHistory, 'someone join the chatRoom!']);
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
        setChatHistory([...currentChatHistory, message]);
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
  }, [socket, currentChatHistory, currentChatRoom, currentChat]);

  useEffect(() => {
    const chatHistoryBox = chatHistoryRef.current;
    const gap = chatHistoryBox.scrollHeight - chatHistoryBox.scrollTop
    console.log('gap: ', gap);
    if (gap < 230)
      chatHistoryBox.scrollTop = chatHistoryBox.scrollHeight;
  }, [currentChatHistory]);

	useEffect(() => {
		console.log('map update!');
	}, [userChatRooms]);

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
      setChatHistory([...currentChatHistory, 'You: ' + currentChat]);

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

  const leftChannel = () => {
    console.log('방나가기 이벤트');
    const data = {
      "roomName": currentChatRoom,
      "userId": socket.userId,
    };
    //console.log('data: ', data);
    socket.emit('leftChannel', data, (message)=> {
      console.log('leftChannel: ', message);
      setModalMessage(message);
      setIsModalOpen(true);

      const isError = true;

      // ㅇㅔ러가 발생한 경우
      if (isError) {
        return;
      }

      // 성공한 경우

      //1. chatRooms에서 나간 채널을 삭제합니다.

      //2. currentChatRoom을 chatRooms의 첫번째 방으로 재설정합니다.

    });
  }

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

  return (
    <div className="x-page">
			<button onClick={() => console.log('userState' , userChatRooms)}>checkState</button>
      <button onClick={() => console.log(myData)}>myData확인버튼</button>
      <h1>{userChatRooms.size === 0 ? "You are not join any room!" : currentChatRoom}</h1>
      <div className="x-page-top">
        <button>Normal Button</button>
        <button>Expand Button</button>
      </div>
      <hr></hr>
      <div className="x-page-bottom">
        <div
          className="chat-history-box"
          ref={chatHistoryRef}
        >
          {isModalOpen && (
            <div className="popup">
            <button className="close-button" onClick={() => setIsModalOpen(false)}>X</button>
            <h1>🚀 Modal 🚀</h1>
            <p className="scoreboard">{modalMessage}</p>
            {/* <Link to="/a">
              <button className="go-main" onClick={()=>{console.log('click!')}}>메인 화면으로 돌아가기</button>
            </Link> */}
            </div>
          )}
          <label>
            Channel Kind:
            <select >
							{Array.from(userChatRooms).map(([key, chatRoom]) => {
								console.log('foreach chatRoom: ', chatRoom, key);
								console.log('roomname: ', chatRoom.roomname);
								return (
									<option key={key} value={chatRoom.roomname}>
										{chatRoom.roomname}
									</option>
								);
							})}
							<option key={9} value={'fuck'}>fuck</option>
            </select>
            <button onClick={leftChannel}>방나가기</button>
          </label>
          <ul>
            {currentChatHistory.map((chat, index) => (
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

        <ChannelLookup setChatHistory={setChatHistory} setCurrentChatRoom={setCurrentChatRoom} socket={socket} chatRooms={chatRooms} userChatRooms={userChatRooms} setUserChatRooms={setUserChatRooms}/>
      </div>
    </div>
  );
};

export default XPage;
