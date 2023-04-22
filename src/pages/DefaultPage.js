import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import io from 'socket.io-client';

//const socket = io('http://localhost:3001'); // Replace with your SocketIO server URL

const DefaultPage = ({socket}) => {
  const navigate = useNavigate();

  useEffect(() => {
    socket.on('matchingcomplete', () => {
        console.log('matchingcomplete2')
      navigate('/game');
    });
  }, [navigate, socket]);

  return (
    <div>
      <h1>Default Main Page!</h1>
    </div>
  );
};

export default DefaultPage;
