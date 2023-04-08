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
import Game from './pages/YPage';


const socket = io("ws://localhost:8000");

const exampleChatHistory = [
  // 'Hello, how are you?',
  // 'I am doing well, thanks for asking.',
  // 'What have you been up to lately?',
  // 'Not much, just working on some coding projects.',
];

function App() {
  const [isLeftPlayer, setIsLeftPlayer] = useState(true);
  const [isConnected, setIsConnected] = useState(socket.connected);
  const [lastPong, setLastPong] = useState(null);
  const [chatHistory, setChatHistory] = useState(exampleChatHistory);
  const [currentChat, setCurrentChat] = useState('');

  const [pos1, setPos1] = useState(0);
  const [pos2, setPos2] = useState(0);

  useEffect(() => {
    socket.on('connect', () => {
      setIsConnected(true);
    });

    socket.on('disconnect', () => {
      setIsConnected(false);
    });

    socket.on('pong', () => {
      setLastPong(new Date().toISOString());
    });

    socket.on('isLeft', (num) => {
      const number = parseInt(num);
      if (number === 1)
        setIsLeftPlayer(true);
      else
        setIsLeftPlayer(false);
      // else
      //   console.log('이미 방이 다찼습니다... ㅠ.ㅠ');
    });

    socket.on('welcome', (num) => {
      setChatHistory([...chatHistory, 'someone join the chatRoom!']);
      console.log('someone join the chatRoom');
      console.log(`현재 방에 들어와 있던 인원은 ${num}명입니다`);
    });

    socket.on('render', (pos1, pos2) => {
      console.log('render');
      setPos1(pos1);
      setPos2(pos2);
    });

    socket.on('chat', (chat) => {
      setChatHistory([...chatHistory, chat]);
    })

    return () => {
      // 이거 왜함?
      socket.off('connect');
      socket.off('disconnect');
      socket.off('pong');
      socket.off('welcome');
      socket.off('render');
      socket.off('isLeft');
    };
  }, [chatHistory, isLeftPlayer]);

  const sendPing = () => {
    socket.emit('ping');
  }

  const sendJoin = () => {
    console.log('emit join event from client');
    socket.emit('join', 'gshim');
  }

  const sendHi = () => {
    console.log('sendHi');
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
        <div className="App-content">
          <Navigation />
          <div>
            <h1>HI</h1>
            <p>Connected: { '' + isConnected }</p>
            <p>Last pong: { lastPong || '-' }</p>
            <p>IsLeftPlayer: { '' + isLeftPlayer }</p>
            <button onClick={sendPing}>Send ping</button>
            <button onClick={sendJoin}>Join</button>
            <button onClick={sendHi}>chat hi</button>
          </div>
          <Routes>
            <Route path="/a" element={<XPage chatHistory={chatHistory} onChatSubmit={handleChatSubmit} onChatChange={handleChatChange} currentChat={currentChat} />} />
            <Route path="/game" element={<Game isLeftPlayer={isLeftPlayer} socket={socket} pos1={pos1} pos2={pos2} />} />
            <Route path="/c" element={<ZPage />} />
            <Route path="/profile" element={<ProfilePage />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;
