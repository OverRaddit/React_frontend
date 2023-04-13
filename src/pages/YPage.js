import React, { useState, useEffect, useRef } from 'react';




function Game({ isLeftPlayer, socket, pos1, pos2 }) {
  // const [userLeft, setUserLeft] = useState();
  console.log("hi");
  const canvasRef = useRef(null);
  const canvasMaxWidth = 800;
  const canvasMaxHeight = 600;
  const moveValue = 8

  useEffect(() => {
    const canvas = canvasRef.current;    
    const ctx = canvas.getContext("2d");
    const PaddleState = {
      STOP: 1, MOVEUP: 2, MOVEDOWN: 3
    };
    const userLeft = {
      x: 0,
      y:canvas.height / 2 - 100 / 2,
      width : 10,
      height: 100,
      color:"WHITE",
      score:0,
      state:0
    };

    const userRight = {
      x: canvas.width - 10,
      y: canvas.height / 2 - 100 / 2,
      width : 10,
      height: 100,
      color:"WHITE",
      score:0,
      state:0
    }

    const ball = {
      x: canvas.width / 2,
      y: canvas.height / 2,
      radius: 10,
      speed : 5,
      velocityX : 5,
      velocityY : 5,
      color: "WHITE"
    }
    const net = {
      x : canvas.width / 2 - 1,
      y : 0,
      width : 2,
      height : 10,
      color : "WHITE"
    }

    function drawNet(){
      for (let i = 0 ; i <= canvas.height ; i += 15)
        drawRect(net.x, net.y + i, net.width, net.height, net.color);
    }
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
    
    // map 그리기
    drawRect(0, 0, canvas.width, canvas.height, "BLACK");

    // draw Circle
    drawCircle(canvas.width / 2, canvas.height / 2, 10, "WHITE");

    function drawText(text, x, y, color){
      ctx.fillStyle = color;
      ctx.font = "35px fantasy";
      ctx.fillText(text, x, y);
    }
    drawText("Something", 10, 50, "WHITE");

    

    function render(){
      //clear the canvas
      drawRect(0, 0, canvas.width, canvas.height, "BLACK");

      // draw the net
      drawNet();

      // draw score
      drawText(userLeft.score, canvas.width / 4, canvas.height / 5, "WHITE");
      drawText(userRight.score, 3 * canvas.width / 4, canvas.height / 5, "WHITE");

      // draw the user and com paddle
      drawRect(userLeft.x, userLeft.y, userLeft.width, userLeft.height, userLeft.color);
      drawRect(userRight.x, userRight.y, userRight.width, userRight.height, userRight.color);

      drawCircle(ball.x, ball.y, ball.radius, ball.color);
    }
    // control the user paddle
    

    function collision(b, p){
      
      b.top = b.y - b.radius;
      b.bottom = b.y + b.radius;
      b.left = b.x - b.radius;
      b.right = b.x + b.radius;

      p.top = p.y;
      p.bottom = p.y + p.height;
      p.left = p.x;
      p.right = p.x + p.width;
      return b.right > p.left && b.bottom > p.top && 
              b.left < p.right && b.top < p.bottom;
    }

    function resetBall(){
      ball.x = canvas.width / 2;
      ball.y = canvas.height/2;

      ball.speed = 5;
      ball.velocityX = -ball.velocityX; 
    }

    // update
    function update(){
      ball.x += ball.velocityX;
      ball.y += ball.velocityY;

      if (ball.y + ball.radius > canvas.height || ball.y - ball.radius < 0){
        console.log(ball);
        ball.velocityY = -ball.velocityY; 
      }

      let player = (ball.x < canvas.width / 2) ? userLeft : userRight;

      if (collision(ball, player))
      {
        let collidePoint = ball.y - (player.y + player.height / 2);
        collidePoint = collidePoint / (player.height / 2);

        let angleRad = collidePoint * Math.PI / 4;
        let direction = (ball.x < canvas.width /  2) ? 1 : -1;
        ball.velocityX = direction * ball.speed * Math.cos(angleRad);
        ball.velocityY = ball.speed * Math.sin(angleRad);

        ball.speed += 0.1;
      }

      // update paddle
      if (userLeft.state == 1){
        userLeft.y = Math.max(userLeft.y - moveValue, 0);
      }
      else if (userLeft.state == 2){
        userLeft.y = Math.min(userLeft.y + moveValue, canvasMaxHeight - userLeft.height);
      }
      if (userRight.state == 1){
        userRight.y = Math.max(userRight.y - moveValue, 0);
      }
      else if (userRight.state == 2){
        userRight.y = Math.min(userRight.y + moveValue, canvasMaxHeight - userRight.height);
      }

      // update the score
      if (ball.x - ball.radius < 0)
      {
        userRight.score++;
        resetBall();
      } 
      else if (ball.x + ball.radius > canvas.width){
        userLeft.score++;
        resetBall();
      }
    }

    // game init
    function game(){
      update();
      render();
    }

    const handleKeyDown = (event) => {
    if (event.key === 'ArrowUp') {
      userLeft.state = 1;
    } else if (event.key === 'ArrowDown') {
      userLeft.state = 2;
    }

    if (event.key === 'w') {
      userRight.state = 1;
    } else if (event.key === 's') {
      userRight.state = 2;
    }
  };

  const handleKeyUp = (event) => {
    if (event.key === 'ArrowUp') {
      userLeft.state = 0;
    } else if (event.key === 'ArrowDown') {
      userLeft.state = 0;
    }
    if (event.key === 'w') {
      userRight.state = 0;
    } else if (event.key === 's') {
      userRight.state = 0;
    }
  };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);

    // loop
    const framePerSecond = 50;
    setInterval(game, 1000 / framePerSecond);

    // return () => {
    //   window.removeEventListener('keydown', handleKeyDown);
    //   window.removeEventListener('keyup', handleKeyUp);
    //   clearInterval(game);
    // };
  }, []);
  console.log("why excute 2 times");
  return <canvas width={canvasMaxWidth} height ={canvasMaxHeight} ref={canvasRef} />;

}

export default Game;
