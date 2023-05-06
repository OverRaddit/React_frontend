import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import './YPage.css';
import { useNavigate } from 'react-router-dom';

function Game({socket, room}) {
  // console.log("In Game", Value);
  const canvasRef = useRef(null);
  const canvasMaxWidth = 600;
  const canvasMaxHeight = 400;

  const [gameOver, setGameOver] = useState(false);
  const [isInGame, setIsInGame] = useState(true);

  function handleGameOver() {
    setGameOver(true);
  }

  const navigate = useNavigate();
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
  const [colorTemp, setColorTemp] = useState(0);
  const [gameMode, setGameMode] = useState(1);

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
	}
	//   if (gameMode == 1)
	//   {
	// 	if (colorTemp == 0)
	// 	{
	// 		drawCircle(ball.x, ball.y, ball.radius, "WHITE");
	// 		setColorTemp(1);
	// 	}
	// 	else
	// 	{
	// 		drawCircle(ball.x, ball.y, ball.radius, "BLACK");
	// 		setColorTemp(0);
	// 	}
	//   }
	//   else
	//   {
	// 	drawCircle(ball.x, ball.y, ball.radius, "WHITE");
	//   }
    // }
    render();

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    // console.log(pos1.x, pos1.y, pos2.x, pos2.y);
    return () =>{
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    }
    }, [pos1, pos2, ball])

	useEffect(()=> {
		//테스트용 변수
		const gshimData = {"intraid":"gshim","avatar":"https://cdn.intra.42.fr/users/5b318ee00454b41113089517347a42ed/gshim.jpg","nickname":"anon_1","isotp":false,"email":"gshim@student.42seoul.kr","wincount":0,"losecount":0,"rating":1200,"id":1};
		// socket.emit('getProfile', dbId, applyProfile(data, 1));
		// socket.emit('getProfile', dbId, applyProfile(data, 2));
		applyProfile(gshimData, 1);
		applyProfile(gshimData, 2);
		socket.on('gameover', (data)=> {
			const {state, message, dataObject} = data;
			const {player} = dataObject;
			console.log('game over! ', player, 'p wins.');
			setGameOver(true);
		});

		socket.on('afk', (player) => {
			console.log(player, 'p disconnected.', player == 1 ? 2 : 1, 'p wins.');
			//백 측에서 게임을 멈춰야 함.
			setGameOver(true);
		});
		if (socket.status != "in-game")
		{
			window.alert('잘못된 접근입니다.');
			setIsInGame(false);
			navigate('/');
		}
		else
		{
			setIsInGame(true);
		}

		const handleBackForward = (event) => {
			socket.emit('playerBackspace', room, playerId);
			console.log("사용자의 뒤로가기 혹은 앞으로가기가 감지되었습니다.");
			window.history.back();
		};

		window.addEventListener('popstate', handleBackForward);

		return () => {
			window.removeEventListener('popstate', handleBackForward);
		}
	}, []);



//   const handleKeyDown = (event) => {
    
  const handleKeyDown = (event) => {
    if (!keyDown) {
      if (event.key === 'ArrowUp') {
        console.log('Player: ', room, playerId, "press up");
        socket.emit('handleKeyPressUp', {roomName:room, id:playerId});
      } else if (event.key === 'ArrowDown') {
        console.log('Player: ', room, playerId, "press down");
        socket.emit('handleKeyPressDown', {roomName:room, id:playerId});
      }
      setKeyDown(true);
    }
  };

  const handleKeyUp = (event) => {
    if (event.key === 'ArrowUp') {
      console.log('Player: ', room, playerId, "relese up");
      socket.emit('handleKeyRelUp', {roomName:room, id:playerId});
    } else if (event.key === 'ArrowDown') {
      console.log('Player: ', room, playerId, "relese down");
      socket.emit('handleKeyRelDown', {roomName:room, id:playerId});
    }
    setKeyDown(false);
  };

  const backToMain = () => {
	socket.status = "online";
	socket.emit('status', socket.status);
	setIsInGame(false);
  }

  const applyProfile = (data, playerNumber) => {
	if (playerNumber == 1)
	{
		document.querySelector(".profile-pic-first").src = data.avatar;
		document.querySelector(".nickname-first").textContent = data.nickname;
		document.querySelector(".ratingText-first").textContent = 'MMR : ' + data.rating;
		document.querySelector(".historyText-first").textContent = '전적 : ' + data.wincount + '승 ' + data.losecount + '패';
	}
	else if (playerNumber == 2)
	{
		document.querySelector(".profile-pic-second").src = data.avatar;
		document.querySelector(".nickname-second").textContent = data.nickname;
		document.querySelector(".ratingText-second").textContent = 'MMR : ' + data.rating;
		document.querySelector(".historyText-second").textContent = '전적 : ' + data.wincount + '승 ' + data.losecount + '패';
	}
  }

return (
	<>
	{isInGame && (
	<div className="game-container">
		<div className="canvas-container">
		<canvas width={canvasMaxWidth} height={canvasMaxHeight} ref={canvasRef} />
		<button className="pop-button" onClick={() => setGameOver(true)}>Launch popup</button>
		{gameOver && (
			<div className="popup">
			<button className="close-button" onClick={() => setGameOver(false)}>X</button>
			<h1>Game End!</h1>
			<p className="scoreboard">{pos1.score} : {pos2.score}</p>
			<Link to="/">
				<button className="go-main" onClick={backToMain}>메인 화면으로 돌아가기</button>
			</Link>
			</div>
		)}
		</div>
		<div className="container-wrapper">
		<div className="container">
		  <div className="profile-container">
			<img className="profile-pic-first" src={''} alt="Profile picture" />
			<div className="nickname"><text className='nickname-first'>{'nickname'}</text></div>
			<div className="profile-details">
				<div className="rating"><text className='ratingText-first'>{'MMR : 0000'}</text></div>
				<div className="history"><text className='historyText-first'>{'전적 : none'}</text></div>
			</div>
		  </div>
		</div>
		<div className="container">
		  <div className="profile-container">
			<img className="profile-pic-second" src={''} alt="Profile picture" />
			<div className="nickname"><text className='nickname-second'>{'nickname'}</text></div>
			<div className="profile-details">
				<div className="rating"><text className='ratingText-second'>{'MMR : 0000'}</text></div>
				<div className="history"><text className='historyText-second'>{'전적 : none'}</text></div>
			</div>
		  </div>
		</div>
		</div>
	</div>
	)}
	{!isInGame && (
	  <div>
		<h1>잘못된 접근입니다. 메인 화면에서 Join 버튼을 통해 게임을 시작해주세요.</h1>
		<Link to="/"><button className="go-main">메인 화면으로 돌아가기</button></Link>
	  </div>
	)}
	</>
  );
}

export default Game;
