import logo from './logo.svg';
import './App.css';
import React, { useState, useEffect } from 'react';
import io from 'socket.io-client';
import Navigation from './navigation/Navigation.tsx';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import XPage from './pages/XPage';
import YPage from './pages/YPage';
import ZPage from './pages/ZPage';
import DefaultPage from './pages/DefaultPage';
import ProfilePage from './profile/ProfilePage.tsx';
import LoginPage from './login/LoginPage.tsx';
import JoinPage from './join/JoinPage';
import OtpPage from './otp/OtpPage';
import Game from './pages/YPage';

const socket = io("ws://localhost:8000");

function App() {
  const [isLeftPlayer, setIsLeftPlayer] = useState(0); // TODO
  const [isConnected, setIsConnected] = useState(socket.connected);
  const [lastPong, setLastPong] = useState(null);
  const [room, setRoom] = useState('none');
  const [isInQueue, setIsInQueue] = useState(false);
  const [isNavigationVisible, setIsNavigationVisible] = useState(true);

  const showNavigation = () => {
    setIsNavigationVisible(true);
  };

  const hideNavigation = () => {
    setIsNavigationVisible(false);
  };

  useEffect(() => {
    console.log("useEffect");
    socket.on('connect', () => {
      console.log("connect");
	  socket.status = "online";
	  socket.emit('status', socket.status);
      setIsConnected(true);
    });

    socket.on('enqueuecomplete', (state) => {
      if (state === 200)
      {
        // modal
        console.log("queue에 삽입되었습니다.")
        // if click button cancel, emit 'cancel queue' event param[socketId]

        // change status
        socket.status = "inQueue";
        socket.emit('status', socket.status);

        // if click button cancel, emit 'cancel queue' event param[socketId]
        setIsInQueue(true);
        document.body.classList.add('modal-open');
      }
    })

    socket.on('matchingcomplete', (state, roomName) => {
      console.log('matchingcomplete1')
      console.log(state, roomName);
      if (state === 200)
      {
        //window.location.href='http://localhost:3001/game'
        console.log("matching 완료")
		setIsInQueue(false);
		document.body.classList.remove('modal-open');
		socket.status = "inGame";
		socket.emit('status', socket.status);
        setRoom(roomName);
        console.log(roomName);
      }
    });

    socket.on('disconnect', () => {
      console.log("disconnect");
      setIsConnected(false);
    });

    return () => {
      // 이거 왜함?
      // socket.off('connect');
      // socket.off('disconnect');
      // socket.off('pong');
      // socket.off('welcome');
      // socket.off('render');
      // socket.off('isLeft');
    };
  }, [isLeftPlayer]);

  const sendPing = () => {
    socket.emit('ping');
  }

  const sendJoin = () => {
    console.log("언제 Join");
    socket.emit('match', false);
    // socket.emit('join', 'gshim');
  }

  const cancelQueue = () => {
	console.log("cancelQueue called")
	socket.emit('cancel queue', false);
	setIsInQueue(false);
	document.body.classList.remove('modal-open');
  }

  // socket.on('matchingcomplete', (state, roomName) => {
  //   console.log(state, roomName);
  //   if (state === 200)
  //   {
  //     console.log("matching 완료")
  //     setRoom(roomName);
  //     console.log(roomName);
  //   }
  // });

  const sendHi = () => {
    socket.emit('chat', "hi");
  }

  return (
    <Router>
      <div className="App">
        <div className={`App-content ${!isNavigationVisible ? 'no-navigation' : ''}`}>
          {isNavigationVisible && <Navigation />}
          {<div>
            <h1>HI</h1>
            <p>Connected: { '' + isConnected }</p>
            <p>Last pong: { lastPong || '-' }</p>
            <p>IsLeftPlayer: { '' + isLeftPlayer }</p>
            {/* <button onClick={sendPing}>Send ping</button> */}
            <button onClick={sendJoin}>Join</button>
            {/* <button onClick={sendHi}>chat hi</button> */}
          </div> }
		  {isInQueue && (
			<>
			<div className="overlay"></div>
        	<div className="queue-popup">
        	  <h1>Finding new opponent..</h1>
			  <button onClick={cancelQueue}>매칭 취소하기</button>
        	</div>
			</>
		  )}
          <Routes>
            <Route path="/" element={<DefaultPage socket={socket}  />} />
            <Route path="/a" element={<XPage />} />
            <Route path="/game" element={<Game socket={socket} room={room}/>} />
            <Route path="/c" element={<ZPage />} />
            <Route path="/profile" element={<ProfilePage userId="alee" isMyProfile={true} />} />
            {/* TODO: 동적으로 props 넣어주는 부분 추가해야함 생각해보니 여기서 다 처리하면 안될것같은데 (youjeon) */}
            <Route path="/login" element={<LoginPage onHideNavigation={hideNavigation}/>} />
            <Route path="/join" element={<JoinPage onHideNavigation={hideNavigation} />} />
            <Route path="/otp" element={<OtpPage onHideNavigation={hideNavigation} />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;
