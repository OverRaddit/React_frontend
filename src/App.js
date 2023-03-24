import logo from './logo.svg';
import './App.css';
import React, { useState, useEffect } from 'react';
import io from 'socket.io-client';
import Navigation from './navigation/Navigation.tsx';

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
    <div className="App">
      <div className="App-content">
        <p>Connected: { '' + isConnected }</p>
        <p>Last pong: { lastPong || '-' }</p>
        <button onClick={sendPing}>Send ping</button>
      </div>
        <Navigation></Navigation>
    </div>
  );
}

export default App;
