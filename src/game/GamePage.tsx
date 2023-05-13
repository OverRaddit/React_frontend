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
  const [gameOver, setGameOver] = useState(false);
  const [isInGame, setIsInGame] = useState(true);
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

  function handleGameOver() {
    setGameOver(true);
  }


  const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (!keyDown) {
      console.log(gameData.roomName, playerId);
      if (e.key === 'ArrowUp') {
        // console.log('Player: ', room, playerId, "press up");
        mySocket?.gameSocket.emit('handleKeyPressUp', { roomName: gameData.roomName, id: playerId });
      } else if (e.key === 'ArrowDown') {
        // console.log('Player: ', room, playerId, "press down");
        mySocket?.gameSocket.emit('handleKeyPressDown', { roomName: gameData.roomName, id: playerId });
      }
      setKeyDown(true);
    }
  };

  const handleKeyUp = (e: React.KeyboardEvent<HTMLDivElement>) => {
    console.log(gameData.roomName, playerId);
    if (e.key === 'ArrowUp') {
      mySocket?.gameSocket.emit('handleKeyRelUp', { roomName: gameData.roomName, id: playerId });
    } else if (e.key === 'ArrowDown') {
      mySocket?.gameSocket.emit('handleKeyRelDown', { roomName: gameData.roomName, id: playerId });
    }
    setKeyDown(false);
  };


  const ballBlinkRate = 50;

  

  useLayoutEffect(() => {
    if (!gameData) {
      window.alert('잘못된 접근입니다.');
      setIsInGame(false);
      navigate('/');
    } else {
      setIsInGame(true);
    }

    setGameMode(gameData.gameType);
    return () => {};
  }, []);

  useEffect(() => {
    const windowKeyDownHandler = (e: KeyboardEvent) => {
      handleKeyDown(e as unknown as React.KeyboardEvent<HTMLDivElement>);
    };
  
    const windowKeyUpHandler = (e: KeyboardEvent) => {
      handleKeyUp(e as unknown as React.KeyboardEvent<HTMLDivElement>);
    };
  
    window.addEventListener('keydown', windowKeyDownHandler);
    window.addEventListener('keyup', windowKeyUpHandler);
  
    return () => {
      window.removeEventListener('keydown', windowKeyDownHandler);
      window.removeEventListener('keyup', windowKeyUpHandler);
    };
  }, [playerId]);

  useEffect(() => {
    mySocket?.gameSocket.on('isLeft', (num: number) => {
      setPlayerId(num);
      console.log("my number", num);
    });
  
    mySocket?.gameSocket.on('render', (pos1: any, pos2: any, ball: any) => {
      setPos1(pos1);
      setPos2(pos2);
      setBall(ball);
    });


    if (!canvasRef.current) return;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

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

    function drawCircle_extension(gameMode: number)
    {
      if (gameMode === 1) {
        if (Math.floor(ball.x / ballBlinkRate) % 2 === 0) {
          drawCircle(ball.x, ball.y, ball.radius, 'WHITE');
        } else {
          drawCircle(ball.x, ball.y, ball.radius, 'BLACK');
        }
      } else {
        drawCircle(ball.x, ball.y, ball.radius, 'WHITE');
      }
    }
  
    function drawNet() {
      for (let i = 0; i <= canvas.height; i += 15)
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
      drawText(pos1.score, canvas.width / 4, canvas.height / 5, "WHITE");
      drawText(pos2.score, 3 * canvas.width / 4, canvas.height / 5, "WHITE");

      drawCircle_extension(gameMode);
    }

    render();
  }, [pos1, pos2, ball]);
  
  return (
    <div
      className="Game"
    >
      {isInGame && (
        <>
          <canvas
            ref={canvasRef}
            width={canvasMaxWidth}
            height={canvasMaxHeight}
          />
          {gameOver && (
            <div className="game-over">
              <h1>게임 오버</h1>
              <Link to="/">홈으로 돌아가기</Link>
            </div>
          )}
        </>
      )}
    </div>
  );
}
  
  export default Game;
  
