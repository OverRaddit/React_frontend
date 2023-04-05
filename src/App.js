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

function App() {
  const [isConnected, setIsConnected] = useState(socket.connected);
  const [lastPong, setLastPong] = useState(null);

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

    return () => {
      socket.off('connect');
      socket.off('disconnect');
      socket.off('pong');
    };
  }, []);

  const sendPing = () => {
    socket.emit('ping');
  }

  return (
    <Router>
      <div className="App">
        <div className="App-content">
          <Navigation />
            <Routes>
              <Route path="/a" element={<XPage />} />
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
