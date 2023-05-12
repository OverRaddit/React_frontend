import React, { useState, useRef, useEffect } from 'react';
import './XPage.css'
import { CreateChannelForm } from 'components/chat/createChannelForm';
import { ChannelLookup } from 'components/chat/ChannelLookUp';
import { useMyContext } from 'MyContext';

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
      //console.log('key1: ', key);
      cookieData[key.trim()] = javascriptObject;
    }
    else
    {
      //console.log('key2: ', key);
      cookieData[key.trim()] = value;
    }
  });

  return cookieData;
}

const XPage = () => {
  //const [currentChatHistory, setCurrentChatHistory] = useState([]);
  const [currentChat, setCurrentChat] = useState('');
  const [chatRooms, setChatRooms] = useState(sampleChannelData);
  //const [currentChatRoom, setCurrentChatRoom] = useState('loading...');  // 현재 선택된 채널의 이름을 저장한다.
  const { myData, setMyData, friends, setFriends, channels, setChannels, mySocket, mapChannels, setMapChannels, currentChannel, setCurrentChannel } = useMyContext();
  const [userChatRooms, setUserChatRooms] = useState(channels);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMessage, setModalMessage] = useState('');
	const [selectedChannel, setSelectedChannel] = useState('');

  const chatHistoryRef = useRef(null); // new2

  useEffect(() => {
    console.log('channels: ', channels);
    if (channels.length === 0) return;

    if (!currentChannel) {
      setCurrentChannel(channels[0]);
    }
    else
      setCurrentChannel(channels.find((channel) => channel.name === currentChannel?.name));
  }, [channels, currentChannel, setCurrentChannel]);

  // useEffect(() => {

	// 	// userChannelList.set('channelName',
	// 	// {
	// 	// kind: 0,
	// 	// roomname: 'testRoom',
	// 	// owner: 'yson',
	// 	// chatHistory : [],
	// 	// });
  //   // const cookies = parseCookie(document.cookie);
  //   // console.log('Xpage cookies: ', cookies);

  //   // const newSocket = initSocket('http://localhost:4242/chat', cookies, setMyData);
  //   // console.log('newSocket: ', newSocket);
	// 	if (mySocket) {
	// 		setSocket(mySocket.chatSocket);
	// 	}
  //   return () => {
  //   };
  // }, []);

  // useEffect(() => {
  //   if (!socket) return;
  //   socket.on('getChannel', (channels) => {
  //     console.log('getChannel: ', channels);
  //     setChatRooms(channels);
  //   });

  //   socket.on('user-join', (data) => {
  //     const { roomName, userId } = data;
  //     console.log(`${userId} joined ${roomName} channel.`);
  //     if (roomName === currentChatRoom)
  //       setCurrentChatHistory([...currentChatHistory, `${userId} joined ${roomName} channel.`]);
  //   });

  //   socket.on('chat', (data) => {
  //     const { message, roomName } = data;
  //     console.log('detect chat event: ', data);

  //     console.log('currentChatRoom: ', currentChatRoom);
  //     console.log('roomName: ', roomName);

  //     // 현재 켜놓고 있는 채널의 chat만 저장합니다.
  //     if (currentChatRoom === roomName)
  //       setCurrentChatHistory([...currentChatHistory, message]);
  //     else
  //       console.log('this room is not opened from my client!');
  //   })

  //   // 왜 여기는 이벤트를 해제하는 리턴 함수를 쓰지 않았지?
  //   return (() => {
  //     socket.off('getChannel');
  //     socket.off('user-join');
  //     //socket.off('welcome');
  //     socket.off('chat');
  // });
  // }, [socket, currentChatHistory, currentChatRoom, currentChat]);

  useEffect(() => {
    const chatHistoryBox = chatHistoryRef.current;
    const gap = chatHistoryBox.scrollHeight - chatHistoryBox.scrollTop
    console.log('gap: ', gap);
    if (gap < 230)
      chatHistoryBox.scrollTop = chatHistoryBox.scrollHeight;
  }, [currentChannel?.chatHistory]);

	// useEffect(() => {
	// 	// 현재 채널 백업
	// 	const previousChannel = channels.find((channel) => channel.name === currentChatRoom);
  //   console.log('previousChannel: ', previousChannel);
	// 	if (previousChannel)
	// 		previousChannel.chatHistory = currentChatHistory;

  //   // 선택된 채널로 전환
	// 	const selectedChannelData = channels.find((channel) => channel.name === selectedChannel);
	// 	if (selectedChannelData) {
	// 		console.log('selectedChannelData :', selectedChannelData);
	// 		setCurrentChatRoom(selectedChannelData.roomname);
	// 		setCurrentChatHistory(selectedChannelData.chatHistory);
	// 	}
	// }, [channels, currentChatHistory, currentChatRoom, selectedChannel]);

  const handleChatChange = (e) => {
    setCurrentChat(e.target.value);
  };

  const handleChatSubmit = (e) => {
    e.preventDefault();
    if (currentChat.trim() !== '') {
      mySocket.chatSocket.emit('chat', { roomName: currentChannel.name, message: currentChat});

    // 내 채팅을 채널의 채팅목록에 추가하는 코드===================
      const channelIndex = channels.findIndex(channel => channel.name === currentChannel.name);
      console.log('channelIndex: ', channelIndex);

      if (channelIndex !== -1) {
        const updatedChannel = {
          ...channels[channelIndex],
          chatHistory: [...channels[channelIndex].chatHistory, 'You: ' + currentChat]
        };

        const updatedChannels = [
          ...channels.slice(0, channelIndex),
          updatedChannel,
          ...channels.slice(channelIndex + 1)
        ];

        console.log('updatedChannels: ', updatedChannels);
        setChannels(updatedChannels);
      }
    // 내 채팅을 채널의 채팅목록에 추가하는 코드===================
      setCurrentChat('');
    }
  };

  const leftChannel = () => {
    console.log('방나가기 이벤트');
    const data = {
      "roomName": currentChannel.name,
    };
    mySocket.chatSocket.emit('leftChannel', data, (response)=> {
      console.log('leftChannel: ', response);
      setModalMessage(response.message);
      setIsModalOpen(true);

      // ㅇㅔ러가 발생한 경우
      if (!response.success) return;

      // 성공한 경우
      setChannels(channels.filter((channel) => channel.name !== currentChannel.name));
      //1. chatRooms에서 나간 채널을 삭제합니다.
      //2. currentChatRoom을 chatRooms의 첫번째 방으로 재설정합니다.
    });
  }

	const switchRoom = (event) =>
	{
    console.log('switchRoom] chathistory: ');
    console.log('switchRoom] channels:', channels);

    // 선택한 channel의 대화목록을 불러오기
    const selectedRoomName = event.target.value;
    const selectedChannel = channels.find((channel) => channel.name === selectedRoomName);
    setCurrentChannel(selectedChannel);
  }

  const debugAllState = () => {
    console.log('---------------------------------------------');
    console.log('currentChatHistory: ', currentChannel.chatHistory);
    console.log('currentChannel: ', currentChannel);
    console.log('channels: ', channels);
    console.log('selectedChannel: ', selectedChannel);
    console.log('---------------------------------------------');
  }

  return (
    <div className="x-page">
			<button onClick={debugAllState}>debugAllState</button>
			<button onClick={() => console.log('channels : ', channels)}>channels</button>
			<button onClick={() => console.log('currentRoom : ', currentChannel)}>currentRoom</button>
			<button onClick={() => console.log('selectedRoomHistory : ', channels.find((channel) => channel.name === selectedChannel))}>currentChannel ChatHistory</button>
			<button onClick={() => console.log('currentChatHistory : ', currentChannel.chatHistory)}>currentChatHistory</button>
      <button onClick={() => console.log(myData)}>myData확인버튼</button>
      <h1>{channels.size === 0 ? "You are not join any room!" : currentChannel?.name}</h1>
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
            채팅방 목록:
            <select value={currentChannel?.name} onChange={switchRoom}>
              {channels.map((channel) => {
                return (
                  <option key={channel.name} value={channel.name}>
                    {channel.name}
                  </option>
                );
              })}
            </select>
            <button onClick={leftChannel}>방나가기</button>
          </label>
          <ul>
            {currentChannel?.chatHistory?.map((chat, index) => (
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
            <CreateChannelForm />
          </>
          : <h3>you can't make room now!</h3>
        }

        <ChannelLookup chatRooms={chatRooms} setSelectedChannel={setSelectedChannel}/>
      </div>
    </div>
  );
};

export default XPage;
