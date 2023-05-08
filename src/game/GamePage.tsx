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
  const [pos1, setPos1] = useState({ x: 0, y: 0, width: 0, height: 0 });
  const [pos2, setPos2] = useState({ x: 0, y: 0, width: 0, height: 0 });
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

  const ballBlinkRate = 50;

  mySocket?.gameSocket.on('isLeft', (num: string) => {
    const number = parseInt(num);
    setPlayerId(number);
    console.log("my number", num);
  });

  mySocket?.gameSocket.on('render', (pos1: any, pos2: any, ball: any) => {
    setPos1(pos1);
    setPos2(pos2);
    setBall(ball);
  });

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
    function drawCircle_extension(gameMode: number) {
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
  
      function render() {
        drawRect(0, 0, canvasMaxWidth, canvasMaxHeight, 'BLACK');
        drawRect(pos1.x, pos1.y, pos1.width, pos1.height, 'WHITE');
        drawRect(pos2.x, pos2.y, pos2.width, pos2.height, 'WHITE');
        drawRect(net.x, net.y, net.width, net.height, net.color);
        drawCircle_extension(gameMode);
      }
  
      render();
    }, [pos1, pos2, ball]);
  
    const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
      if (!keyDown) {
        console.log(gameData);
        console.log(gameData.roomName);
        setKeyDown(true);
        mySocket?.gameSocket.emit('keyDown', {roomName:gameData.roomName, id:playerId});
      }
      console.log(playerId);

    };
  
    const handleKeyUp = (e: React.KeyboardEvent<HTMLDivElement>) => {
      if (keyDown) {
        setKeyDown(false);
        mySocket?.gameSocket.emit('keyUp', {roomName:gameData.roomName, id:playerId});
      }
    };
  
    return (
      <div
        className="Game"
        tabIndex={0}
        onKeyDown={handleKeyDown}
        onKeyUp={handleKeyUp}
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
  
