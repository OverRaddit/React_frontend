import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import io from 'socket.io-client';

//const socket = io('http://localhost:3001'); // Replace with your SocketIO server URL

const DefaultPage = ({socket}) => {
  const navigate = useNavigate();
  const [inputText, setInputText] = useState('');

  useEffect(() => {
    socket.on('matchingcomplete', () => {
        console.log('matchingcomplete2')
      navigate('/game');
    });
  }, [navigate, socket]);

  const handleClick = (e) => {
	setInputText(e.target.value);
  }

  const sendInvite = () => {
	console.log(inputText + "님에게 초대를 보냈습니다.");
  }

  return (
    <div>
      <h1>Default Main Page!</h1>
	  <input id='inputTextField' type="text" onChange={handleClick} placeholder='Input username'></input>
	  <button onClick={sendInvite}>초대하기</button>
    </div>
  );
};

export default DefaultPage;
