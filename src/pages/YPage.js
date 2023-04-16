import React, { useState, useEffect, useRef } from 'react';

function Game({ isLeftPlayer, socket, pos1, pos2, Value }) {
  // console.log("In Game", Value);
  const canvasRef = useRef(null);
  const canvasMaxWidth = 1000;
  const canvasMaxHeight = 1000;
  const moveValue = 8

  const [isMovingUp, setIsMovingUp] = useState(false);
  const [isMovingDown, setIsMovingDown] = useState(false);
  const downKeyPressRef = useRef(false);

  const [ball, setBall] = useState({Value});
  const [count, setCount] = useState(0);


  useEffect(() => {
    console.log("Test");
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

    function render(){
      //clear the canvas
      console.log("test\n");
      drawRect(0, 0, canvasMaxWidth, canvasMaxHeight, "BLACK");

      // draw the net
      // drawNet();

      // draw score
      // drawText(userLeft.score, canvas.width / 4, canvas.height / 5, "WHITE");
      // drawText(userRight.score, 3 * canvas.width / 4, canvas.height / 5, "WHITE");

      // draw the user and com paddle
      // drawRect(userLeft.x, userLeft.y, userLeft.width, userLeft.height, userLeft.color);
      // drawRect(userRight.x, userRight.y, userRight.width, userRight.height, userRight.color);
      // console.log("너나?",ball);
      console.log(ball.x, ball.y, ball.radius);
      
      
      drawCircle(ball.x, ball.y, ball.radius, "WHITE");
    }
    render();
    
    // const interval = setInterval(() => {
    //   // console.log("tq");
    //   // let newBall = {...ball}
    //   // // newBall.
    //   // // let newCondition = { ...current };
    //   // console.log("new", newBall);
    //   // // newCondition[]
    //   // setBall(...ball, ball.x = Value.x, ball.y = Value.y);
    //   // render();
    //   // setCount(count => count + 1);
    //   setCount(count=>count + 1);
    //   }, 40);
    return () =>{
      
    }
    }, [ball])

    
  const handleKeyDown = (event) => {
    console.log('Player: ', isLeftPlayer, socket.id);
    if (event.key === 'ArrowUp') {
      socket.emit('handleKeyPressUp', isLeftPlayer);
    } else if (event.key === 'ArrowDown') {
      socket.emit('handleKeyPressDown', isLeftPlayer);
    }
  };

  const handleKeyUp = (event) => {
    if (event.key === 'ArrowUp') {
      socket.emit('handleKeyRelUp', isLeftPlayer);
    } else if (event.key === 'ArrowDown') {
      socket.emit('handleKeyRelDown', isLeftPlayer);
    }
  };
  window.removeEventListener('keydown', handleKeyDown);
  window.removeEventListener('keyup', handleKeyUp);
  window.addEventListener('keydown', handleKeyDown);
  window.addEventListener('keyup', handleKeyUp);

  // useEffect(() => {
  //   const canvas = canvasRef.current;    
  //   const ctx = canvas.getContext("2d");
  //   const PaddleState = {
  //     STOP: 1, MOVEUP: 2, MOVEDOWN: 3
  //   };
  //   const userLeft = {
  //     x: 0,
  //     y:canvas.height / 2 - 100 / 2,
  //     width : 10,
  //     height: 100,
  //     color:"WHITE",
  //     score:0,
  //     state:0
  //   };

  //   const userRight = {
  //     x: canvas.width - 10,
  //     y: canvas.height / 2 - 100 / 2,
  //     width : 10,
  //     height: 100,
  //     color:"WHITE",
  //     score:0,
  //     state:0
  //   }

  //   const net = {
  //     x : canvas.width / 2 - 1,
  //     y : 0,
  //     width : 2,
  //     height : 10,
  //     color : "WHITE"
  //   }

  //   function drawNet(){
  //     for (let i = 0 ; i <= canvas.height ; i += 15)
  //       drawRect(net.x, net.y + i, net.width, net.height, net.color);
  //   }
  //   function drawRect(x, y, w, h, color)
  //   {
  //     ctx.fillStyle = color;
  //     ctx.fillRect(x, y, w, h);
  //   }

    
    
  //   // map 그리기
  //   drawRect(0, 0, canvas.width, canvas.height, "BLACK");

  //   // draw Circle
  //   drawCircle(canvas.width / 2, canvas.height / 2, 10, "WHITE");

  //   function drawText(text, x, y, color){
  //     ctx.fillStyle = color;
  //     ctx.font = "35px fantasy";
  //     ctx.fillText(text, x, y);
  //   }
  //   drawText("Something", 10, 50, "WHITE");

    

  //   function render(){
  //     //clear the canvas
  //     drawRect(0, 0, canvas.width, canvas.height, "BLACK");

  //     // draw the net
  //     drawNet();

  //     // draw score
  //     drawText(userLeft.score, canvas.width / 4, canvas.height / 5, "WHITE");
  //     drawText(userRight.score, 3 * canvas.width / 4, canvas.height / 5, "WHITE");

  //     // draw the user and com paddle
  //     drawRect(userLeft.x, userLeft.y, userLeft.width, userLeft.height, userLeft.color);
  //     drawRect(userRight.x, userRight.y, userRight.width, userRight.height, userRight.color);

  //     drawCircle(ball.x, ball.y, ball.radius, ball.color);
  //   }
  //   // control the user paddle
    

  //   function collision(b, p)
  //   {
  //     b.top = b.y - b.radius;
  //     b.bottom = b.y + b.radius;
  //     b.left = b.x - b.radius;
  //     b.right = b.x + b.radius;

  //     p.top = p.y;
  //     p.bottom = p.y + p.height;
  //     p.left = p.x;
  //     p.right = p.x + p.width;
  //     return b.right > p.left && b.bottom > p.top && 
  //             b.left < p.right && b.top < p.bottom;
  //   }

  //   function resetBall(){
  //     ball.x = canvas.width / 2;
  //     ball.y = canvas.height/2;

  //     ball.speed = 5;
  //     ball.velocityX = -ball.velocityX; 
  //   }

  //   // update
  //   function update(){
  //     ball.x += ball.velocityX;
  //     ball.y += ball.velocityY;

  //     if (ball.y + ball.radius > canvas.height || 
  //         ball.y - ball.radius < 0){
  //       // console.log(ball);
  //       ball.velocityY = -ball.velocityY; 
  //     }

  //     let player = (ball.x < canvas.width / 2) ? userLeft : userRight;

  //     if (collision(ball, player))
  //     {
  //       let collidePoint = ball.y - (player.y + player.height / 2);
  //       collidePoint = collidePoint / (player.height / 2);

  //       let angleRad = collidePoint * Math.PI / 4;
  //       let direction = (ball.x < canvas.width /  2) ? 1 : -1;
  //       ball.velocityX = direction *  ball.speed * Math.cos(angleRad);
  //       ball.velocityY =              ball.speed * Math.sin(angleRad);

  //       ball.speed += 0.1;
  //     }

  //     // update paddle
  //     if (userLeft.state == 1){
  //       userLeft.y = Math.max(userLeft.y - moveValue, 0);
  //     }
  //     else if (userLeft.state == 2){
  //       userLeft.y = Math.min(userLeft.y + moveValue, canvasMaxHeight - userLeft.height);
  //     }
  //     if (userRight.state == 1){
  //       userRight.y = Math.max(userRight.y - moveValue, 0);
  //     }
  //     else if (userRight.state == 2){
  //       userRight.y = Math.min(userRight.y + moveValue, canvasMaxHeight - userRight.height);
  //     }

  //     // update the score
  //     if (ball.x - ball.radius < 0)
  //     {
  //       userRight.score++;
  //       resetBall();
  //     } 
  //     else if (ball.x + ball.radius > canvas.width){
  //       userLeft.score++;
  //       resetBall();
  //     }
  //   }

  //   // game init
  //   function game(){
  //     update();
  //     render();
  //   }

  //   const handleKeyDown = (event) => {
  //     // console.log(isLeftPlayer);
  //   if (event.key === 'ArrowUp') {
  //     userLeft.state = 1;
  //   } else if (event.key === 'ArrowDown') {
  //     userLeft.state = 2;
  //   }

  //   if (event.key === 'w') {
  //     userRight.state = 1;
  //   } else if (event.key === 's') {
  //     userRight.state = 2;
  //   }
  // };

  // const handleKeyUp = (event) => {
  //   if (event.key === 'ArrowUp') {
  //     userLeft.state = 0;
  //   } else if (event.key === 'ArrowDown') {
  //     userLeft.state = 0;
  //   }
  //   if (event.key === 'w') {
  //     userRight.state = 0;
  //   } else if (event.key === 's') {
  //     userRight.state = 0;
  //   }
  // };

  //   window.addEventListener('keydown', handleKeyDown);
  //   window.addEventListener('keyup', handleKeyUp);

  //   // loop
  //   const framePerSecond = 50;
  //   setInterval(game, 1000 / framePerSecond);
  // }, []);
  // console.log("why excute 2 times");
  return <canvas width={canvasMaxWidth} height ={canvasMaxHeight} ref={canvasRef} />;
}

export default Game;
