import React, { useState, useEffect, useRef } from 'react';




function Game({ isLeftPlayer, socket, pos1, pos2 }) {
  // const [userLeft, setUserLeft] = useState();
  const canvasRef = useRef(null);
  
  useEffect(() => {
    const canvas = canvasRef.current;    
    const ctx = canvas.getContext("2d");
    const userLeft = {
      x: 0,
      y:canvas.height / 2 - 100 / 2,
      width : 10,
      height: 100,
      color:"WHITE",
      score:0
    };

    const userRight = {
      x: canvas.width - 10,
      y: canvas.height / 2 - 100 / 2,
      width : 10,
      height: 100,
      color:"WHITE",
      score:0
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
    function collision(b, p){
      p.top = p.y;
      p.bottom = p.y + p.height;
      p.left = p.x;
      p.right = p.x + p.width;
    
      b.top = b.y - b.radius;
      b.bottom = b.y +b.radius;
      b.left = b.x -b.radius;
      b.right = b.x +b.radius;
    
      return b.right > p.left && b.btop < p.bottom && b.left < p.right && b.bottom > p.top;
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
        ball.velocityY = -ball.velocityY;
        
      }
      //console.log(ball.x, ball.y);
      //console.log(userRight.x, userRight.y);

      let player = (ball.x < canvas.width / 2) ? userLeft : userRight;

      // console.log(player);
      if (collision(ball, player))
      {
        console.log("hi");
        let collidePoint = ball.y - (player.y + player.height / 2);
        collidePoint = collidePoint / (player.height / 2);

        let angleRad = collidePoint * Math.PI / 4;
        let direction = (ball.x < canvas.width /  2) ? 1 : -1;
        ball.velocityX = direction * ball.speed * Math.cos(angleRad);
        ball.velocityY = ball.speed * Math.sin(angleRad);

        ball.speed += 0.1;
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
    //console.log('isLeftPlayer: ', isLeftPlayer);
    if (event.key === 'ArrowUp') {
      console.log("up");
      //socket.emit('handleKeyPressUp', isLeftPlayer);
      userLeft.y = Math.max(0, userLeft.y - 4);
    } else if (event.key === 'ArrowDown') {
      userLeft.y = Math.min(50, userLeft.y + 4);
      //downKeyPressRef.current = true;
      //socket.emit('handleKeyPressDown', isLeftPlayer);
      //if (position < 2) { // check if there is room to move down
      //}
    }

    if (event.key === 'ArrowLeft') {
      console.log("up");
      //socket.emit('handleKeyPressUp', isLeftPlayer);
      
      userRight.y = Math.max(0, userRight.y - 4);
    } else if (event.key === 'ArrowRight') {
      console.log("down");
      
      userRight.y = Math.min(50, userRight.y + 4);
      //downKeyPressRef.current = true;
      //socket.emit('handleKeyPressDown', isLeftPlayer);
      //if (position < 2) { // check if there is room to move down
      //}
    }
  };

  const handleKeyUp = (event) => {
    if (event.key === 'ArrowUp') {
      //socket.emit('handleKeyRelUp', isLeftPlayer);
    } else if (event.key === 'ArrowDown') {
      //downKeyPressRef.current = false;
      //socket.emit('handleKeyRelDown', isLeftPlayer);
    }
  };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);

    // loop
    const framePerSecond = 50;
    setInterval(game, 1000 / framePerSecond);
  }, []);

  return <canvas ref={canvasRef} />;







  // //const [position, setPosition] = useState(0);
  // const [isMovingUp, setIsMovingUp] = useState(false);
  // const [isMovingDown, setIsMovingDown] = useState(false);
  // const downKeyPressRef = useRef(false);

  // const handleKeyDown = (event) => {
  //   console.log('isLeftPlayer: ', isLeftPlayer);
  //   if (event.key === 'ArrowUp') {
  //     socket.emit('handleKeyPressUp', isLeftPlayer);
  //   } else if (event.key === 'ArrowDown') {
  //     downKeyPressRef.current = true;
  //     socket.emit('handleKeyPressDown', isLeftPlayer);
  //     //if (position < 2) { // check if there is room to move down
  //     //}
  //   }
  // };

  // const handleKeyUp = (event) => {
  //   if (event.key === 'ArrowUp') {
  //     socket.emit('handleKeyRelUp', isLeftPlayer);
  //   } else if (event.key === 'ArrowDown') {
  //     downKeyPressRef.current = false;
  //     socket.emit('handleKeyRelDown', isLeftPlayer);
  //   }
  // };

  // useEffect(() => {
  //   window.addEventListener('keydown', handleKeyDown);
  //   window.addEventListener('keyup', handleKeyUp);

  //   return () => {
  //     window.removeEventListener('keydown', handleKeyDown);
  //     window.removeEventListener('keyup', handleKeyUp);
  //     //clearInterval(intervalId);
  //   };
  // }, [isMovingUp, isMovingDown, isLeftPlayer]);

  // return (
  //   <div
  //     style={{
  //       width: '500px',
  //       height: '300px',
  //       backgroundColor: 'lightblue',
  //       position: 'relative',
  //       margin: '50px auto',
  //       // padding: '20px',
  //     }}
  //   >
  //     <div
  //       style={{
  //         width: '50px',
  //         height: '100px',
  //         backgroundColor: 'brown',
  //         position: 'absolute',
  //         left: '10px',
  //         top: `${Math.max(Math.min(pos1, 4), -4) * 25 + 100}px`, // adjust the movement and limits here
  //       }}
  //     />

  //     <div
  //       style={{
  //         width: '50px',
  //         height: '100px',
  //         backgroundColor: 'brown',
  //         position: 'absolute',
  //         left: '100px',
  //         top: `${Math.max(Math.min(pos2, 4), -4) * 25 + 100}px`, // adjust the movement and limits here
  //       }}
  //     />


  //     <p>
  //       Press the up or down arrow key to move the wooden bar (restricted to -4
  //       to 4)
  //     </p>
  //     <p> {''+ isLeftPlayer} </p>
  //   </div>
  // );
}

export default Game;
