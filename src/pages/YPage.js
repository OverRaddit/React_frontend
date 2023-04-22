import React, { useState, useEffect, useRef } from 'react';
import './YPage.css';

function Game({socket, room}) {
  // console.log("In Game", Value);
  const canvasRef = useRef(null);
  const canvasMaxWidth = 600;
  const canvasMaxHeight = 400;

  const [gameOver, setGameOver] = useState(false);

  function handleGameOver() {
    setGameOver(true);
  }

  const net = {
    x : canvasMaxWidth / 2 - 1,
    y : 0,
    width : 2,
    height : 10,
    color : "WHITE"
  }
  const [playerId, setPlayerId] = useState(0);
  const [pos1, setPos1] = useState(0);
  const [pos2, setPos2] = useState(0);
  const [ball, setBall] = useState({});
  // const [room, setRoom] = useState("");
  const [keyDown, setKeyDown] = useState(false);

  socket.on('isLeft', (num) => {
    const number = parseInt(num);
    setPlayerId(number);
  });

  socket.on('render', (pos1, pos2, ball) => {
    // console.log(roomdId);
    setPos1(pos1);
    setPos2(pos2);
    setBall(ball);
  });

  useEffect(() => {
    const canvas = canvasRef.current;    
    const ctx = canvas.getContext("2d");
    function drawRect(x, y, w, h, color)
    {
      ctx.fillStyle = color;
      ctx.fillRect(x, y, w, h);
    }

    function drawCircle(x, y, r, color)
    {
      ctx.fillStyle = color;
      ctx.beginPath();
      ctx.arc(x, y, r, 0, Math.PI*2, false);
      ctx.closePath();
      ctx.fill();
    }
    function drawText(text, x, y, color){
      ctx.fillStyle = color;
      ctx.font = "35px fantasy";
      ctx.fillText(text, x, y);
    }

    function drawNet(){
      for (let i = 0 ; i <= canvas.height ; i += 15)
        drawRect(net.x, net.y + i, net.width, net.height, net.color);
    }

    function render(){
      //clear the canvas
      // console.log("test\n");
      drawRect(0, 0, canvasMaxWidth, canvasMaxHeight, "BLACK");
      
      // console.log(pos1, pos2);
      drawRect(pos1.x, pos1.y, pos1.width, pos1.height, "WHITE");
      drawRect(pos2.x, pos2.y, pos2.width, pos2.height, "WHITE");

      // draw the net
      drawNet();

      // draw score
      drawText(pos1.score, canvas.width / 4, canvas.height / 5, "WHITE");
      drawText(pos2.score, 3 * canvas.width / 4, canvas.height / 5, "WHITE");

      // draw the user and com paddle
      // drawRect(userLeft.x, userLeft.y, userLeft.width, userLeft.height, userLeft.color);
      // drawRect(userRight.x, userRight.y, userRight.width, userRight.height, userRight.color);
      // console.log("너나?",ball);
      // console.log(ball.x, ball.y, ball.radius);
      
      
      drawCircle(ball.x, ball.y, ball.radius, "WHITE");

      console.log("qwer");
    }
    render();

    // socket.on('enqueuecomplete', (state) => {
    //   if (state === 200)
    //     console.log("queue에 삽입되었습니다.")
    // })
    
    // socket.on('matchingcomplete', (state, roomName) => {
    //   console.log(state, roomName);
    //   if (state === 200)
    //   {
    //     console.log("matching 완료")
    //     setRoom(roomName);
    //     console.log(roomName);
    //   }
    // });

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    // console.log(pos1.x, pos1.y, pos2.x, pos2.y);
    return () =>{
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    }
    }, [pos1, pos2, ball])

	useEffect(()=> {
		socket.on('gameover', (player)=> {
			console.log('game over! ', player, 'p wins.');
			// handleGameOver();
			setGameOver(true);
		});
	}, []);

	
	

//   const handleKeyDown = (event) => {
    
  const handleKeyDown = (event) => {
    if (!keyDown) {
      if (event.key === 'ArrowUp') {
        console.log('Player: ', room, playerId, "press up");
        socket.emit('handleKeyPressUp', room, playerId);
      } else if (event.key === 'ArrowDown') {
        console.log('Player: ', room, playerId, "press down");
        socket.emit('handleKeyPressDown', room, playerId);
      }
      setKeyDown(true);
    }
  };

  const handleKeyUp = (event) => {
    if (event.key === 'ArrowUp') {
      console.log('Player: ', room, playerId, "relese up");
      socket.emit('handleKeyRelUp', room,  playerId);
    } else if (event.key === 'ArrowDown') {
      console.log('Player: ', room, playerId, "relese down");
      socket.emit('handleKeyRelDown', room, playerId);
    }
    setKeyDown(false);
  };


  return (
	  <div>
	  <canvas width={canvasMaxWidth} height ={canvasMaxHeight} ref={canvasRef} />
      {gameOver && (
        <div className="popup">
		<button className="close-button" onClick={() => setGameOver(false)}>X</button>
          <h2>Game Over!</h2>
          <p>{pos1.score} : {pos2.score}</p>
        </div>
      )}
    </div>
  );
}

export default Game;
