import React, { useState, useRef, useEffect } from 'react';
import './XPage.css'
import { CreateChannelForm } from 'components/chat/createChannelForm';
import initSocket from 'socket';

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


const XPage = ({ chatHistory, onChatSubmit, onChatChange, currentChat }) => {
  const [socket, setSocket] = useState(null);
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
    socket.on('chat', (data) => {
      console.log('[chat]|', data);
    });
  }, [socket]);

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
        <form onSubmit={onChatSubmit}>
          <input
            className='chat-input-box'
            type="text"
            value={currentChat}
            onChange={onChatChange}
            placeholder="Type your chat here"
          />
          <button type="submit">Send</button>
        </form>

        { true ?
          <>
            <h3>Make your own</h3>
            <CreateChannelForm onCreateChannel={onCreateChannel}/>
          </>
          : <h3>you can't make room now!</h3>
        }
      </div>
    </div>
  );
};

export default XPage;
