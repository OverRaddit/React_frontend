import logo from './logo.svg';
import './App.css';
import React, { useState, useEffect } from 'react';
import io from 'socket.io-client';
import Navigation from './navigation/Navigation.tsx';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import XPage from './pages/XPage';
import YPage from './pages/YPage';
import ZPage from './pages/ZPage';
import ProfilePage from './profile/ProfilePage.tsx';
import LoginPage from './login/LoginPage.tsx';
import JoinPage from './join/JoinPage';
import OtpPage from './otp/OtpPage';
import Game from './pages/YPage';


const socket = io("ws://localhost:8000");

const exampleChatHistory = [
  // 'Hello, how are you?',
  // 'I am doing well, thanks for asking.',
  // 'What have you been up to lately?',
  // 'Not much, just working on some coding projects.',
];

function App() {
  const [isLeftPlayer, setIsLeftPlayer] = useState(0); // TODO
  const [isConnected, setIsConnected] = useState(socket.connected);
  const [lastPong, setLastPong] = useState(null);
  const [chatHistory, setChatHistory] = useState(exampleChatHistory);
  const [currentChat, setCurrentChat] = useState('');

  


  const [isNavigationVisible, setIsNavigationVisible] = useState(true);

  const showNavigation = () => {
    setIsNavigationVisible(true);
  };

  const hideNavigation = () => {
    setIsNavigationVisible(false);
  };

  useEffect(() => {
    socket.on('connect', () => {
      console.log("connect");
      setIsConnected(true);
    });

    socket.on('disconnect', () => {
      console.log("disconnect");
      setIsConnected(false);
    });

    // socket.on('pong', () => {
    //   setLastPong(new Date().toISOString());
    // });

    

    socket.on('welcome', (num) => {
      console.log("welcome");
      setChatHistory([...chatHistory, 'someone join the chatRoom!']);
      console.log('someone join the chatRoom');
      console.log(`현재 방에 들어와 있던 인원은 ${num}명입니다`);
    });

    

    socket.on('chat', (chat) => {
      setChatHistory([...chatHistory, chat]);
    })
    return () => {
      // 이거 왜함?
      // socket.off('connect');
      // socket.off('disconnect');
      // socket.off('pong');
      // socket.off('welcome');
      // socket.off('render');
      // socket.off('isLeft');
    };
  }, [chatHistory, isLeftPlayer]);

  const sendPing = () => {
    socket.emit('ping');
  }

  const sendJoin = () => {
    console.log("언제 Join");
    socket.emit('match', false);
    // socket.emit('join', 'gshim');
  }

  const sendHi = () => {
    socket.emit('chat', "hi");
  }

  const handleChatChange = (e) => {
    setCurrentChat(e.target.value);
  };

  const handleChatSubmit = (e) => {
    e.preventDefault();
    if (currentChat.trim() !== '') {
      setChatHistory([...chatHistory, 'You: ' + currentChat]);
      socket.emit('chat', currentChat);
      setCurrentChat('');
    }
  };

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
          <Routes>
            <Route path="/a" element={<XPage chatHistory={chatHistory} onChatSubmit={handleChatSubmit} onChatChange={handleChatChange} currentChat={currentChat} />} />
            <Route path="/game" element={<Game socket={socket}/>} />
            <Route path="/c" element={<ZPage />} />
            <Route path="/profile" element={<ProfilePage />} />
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
