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


const socket = io("ws://localhost:8000");

const exampleChatHistory = [
  // 'Hello, how are you?',
  // 'I am doing well, thanks for asking.',
  // 'What have you been up to lately?',
  // 'Not much, just working on some coding projects.',
];

function App() {
  const [isConnected, setIsConnected] = useState(socket.connected);
  const [lastPong, setLastPong] = useState(null);
  const [chatHistory, setChatHistory] = useState(exampleChatHistory);
  const [currentChat, setCurrentChat] = useState('');

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

    socket.on('welcome', () => {
      setChatHistory([...chatHistory, 'someone join the chatRoom!']);
      console.log('someone join the chatRoom@');
    })

    socket.on('chat', (chat) => {
      setChatHistory([...chatHistory, chat]);
    })

    return () => {
      socket.off('connect');
      socket.off('disconnect');
      socket.off('pong');
    };
  }, [chatHistory]);

  const sendPing = () => {
    socket.emit('ping');
  }

  const sendJoin = () => {
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
            <button onClick={sendPing}>Send ping</button>
            <button onClick={sendJoin}>Join</button>
            <button onClick={sendHi}>chat hi</button>
          </div>
          <Routes>
            <Route path="/a" element={<XPage chatHistory={chatHistory} onChatSubmit={handleChatSubmit} onChatChange={handleChatChange} currentChat={currentChat} />} />
            <Route path="/b" element={<YPage />} />
            <Route path="/c" element={<ZPage />} />
            <Route path="/profile" element={<ProfilePage />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;
