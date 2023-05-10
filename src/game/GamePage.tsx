import React, { useState, useEffect, useRef, useLayoutEffect } from 'react';
import { Link } from 'react-router-dom';
import './GamePage.css';
import { useNavigate, useLocation } from 'react-router-dom';
import { useMyContext } from 'MyContext';


function Game() {
  const navigate = useNavigate();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const canvasMaxWidth = 600;
  const canvasMaxHeight = 400;

  const [playerId, setPlayerId] = useState(0);

  const [pos1, setPos1] = useState({ x: 0, y: 0, width: 0, height: 0, score:0 });
  const [pos2, setPos2] = useState({ x: 0, y: 0, width: 0, height: 0, score:0 });
  const [ball, setBall] = useState({ x: 0, y: 0, radius: 0 });

  const [keyDown, setKeyDown] = useState(false);
  const [gameMode, setGameMode] = useState(0);
  const location = useLocation();
  const gameData = location.state?.gameData.dataObject;

  const net = {
    x: canvasMaxWidth / 2 - 1,
    y: 0,
    width: 2,
    height: 10,
    color: 'WHITE',
  };
  const { mySocket } = useMyContext();

  console.log("sockId", gameData.leftSockId);
  const windowKeyDownHandler = (e: KeyboardEvent) => {
    handleKeyDown(e as unknown as React.KeyboardEvent<HTMLDivElement>);
  };
  
  const windowKeyUpHandler = (e: KeyboardEvent) => {
    handleKeyUp(e as unknown as React.KeyboardEvent<HTMLDivElement>);
  };
  
  const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (e.key === 'ArrowUp') {
      console.log('Player: ', gameData.roomName, playerId, "press up");
      mySocket?.gameSocket.emit('handleKeyPressUp', { roomName: gameData.roomName, id: playerId });
    } else if (e.key === 'ArrowDown') {
      console.log('Player: ', gameData.roomName, playerId, "press down");
      mySocket?.gameSocket.emit('handleKeyPressDown', { roomName: gameData.roomName, id: playerId });
    }
  };
  
  const handleKeyUp = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (e.key === 'ArrowUp') {
      console.log('Player: ', gameData.roomName, playerId, "relese up");
      mySocket?.gameSocket.emit('handleKeyRelUp', { roomName: gameData.roomName, id: playerId });
    } else if (e.key === 'ArrowDown') {
      console.log('Player: ', gameData.roomName, playerId, "relese down");
      mySocket?.gameSocket.emit('handleKeyRelDown', { roomName: gameData.roomName, id: playerId });
    }
  };
  
  
  useEffect(()=>{
    console.log('mySocket: ', mySocket);
    console.log('mySocket.gameSocket: ', mySocket?.gameSocket);
    if (!mySocket) return;

    console.log("sockId", gameData.leftSockId);
    if (mySocket?.gameSocket.id === gameData.leftSockId)
      setPlayerId(1);
    else if (mySocket?.gameSocket.id === gameData.rightSockId)
      setPlayerId(2);
    else setPlayerId(42);

    // 외않되?
    // mySocket.gameSocket.on('matchingcomplete', (statuscode, responseMessage) => {
    //   console.log('matchingcomplete eventhandler:', responseMessage);
    //   if (mySocket?.gameSocket.id === gameData.leftSockId)
    //     setPlayerId(1);
    //   else
    //     setPlayerId(2);
    // });

    mySocket?.gameSocket.on('render', (pos1: any, pos2: any, ball: any) => {
      setPos1(pos1);
      setPos2(pos2);
      setBall(ball);
    });
    
    return () => {
      mySocket?.gameSocket.off('render');
    };
  },[]);
  
  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas!.getContext('2d');

    function drawRect(x: number, y: number, w: number, h: number, color: string) {
      ctx!.fillStyle = color;
      ctx!.fillRect(x, y, w, h);
    }

    function drawCircle(x: number, y: number, r: number, color: string) {
      ctx!.fillStyle = color;
      ctx!.beginPath();
      ctx!.arc(x, y, r, 0, Math.PI * 2, false);
      ctx!.closePath();
      ctx!.fill();
    }

    function drawCircle_extension(gameMode: number) {
      drawCircle(ball.x, ball.y, ball.radius, 'WHITE');
    }
  
    function drawNet() {
      for (let i = 0; i <= canvasMaxHeight; i += 15)
        drawRect(net.x, net.y + i, net.width, net.height, net.color);
    }

    function drawText(text: number, x: number, y: number, color: string) {
      ctx!.fillStyle = color;
      ctx!.font = "35px fantasy";
      ctx!.fillText(text.toString(), x, y);
    }

    function render() {
      drawRect(0, 0, canvasMaxWidth, canvasMaxHeight, 'BLACK');
      drawRect(pos1.x, pos1.y, pos1.width, pos1.height, 'WHITE');
      drawRect(pos2.x, pos2.y, pos2.width, pos2.height, 'WHITE');

      // draw the net
      drawNet();

      // draw score
      drawText(pos1.score, canvasMaxWidth / 4, canvasMaxHeight / 5, "WHITE");
      drawText(pos2.score, 3 * canvasMaxWidth / 4, canvasMaxHeight / 5, "WHITE");

      drawCircle_extension(gameMode);
    }
    

    window.addEventListener('keydown', windowKeyDownHandler);
    window.addEventListener('keyup', windowKeyUpHandler);
    
    render();
    // console.log(pos1, pos2, ball);
    return () => {
      window.removeEventListener('keydown', windowKeyDownHandler);
      window.removeEventListener('keyup', windowKeyUpHandler);
    };
  }, [pos1, pos2, ball]);
  
  return (
    <canvas
      ref={canvasRef}
      width={canvasMaxWidth}
      height={canvasMaxHeight}
    />
  );
}
  
export default Game;
  
