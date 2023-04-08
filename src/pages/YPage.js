import React, { useState, useEffect, useRef } from 'react';

function Game({ isLeftPlayer, socket, pos1, pos2 }) {
  //const [position, setPosition] = useState(0);
  const [isMovingUp, setIsMovingUp] = useState(false);
  const [isMovingDown, setIsMovingDown] = useState(false);
  const downKeyPressRef = useRef(false);

  const handleKeyDown = (event) => {
    console.log('isLeftPlayer: ', isLeftPlayer);
    if (event.key === 'ArrowUp') {
      socket.emit('handleKeyPressUp', isLeftPlayer);
    } else if (event.key === 'ArrowDown' && !downKeyPressRef.current) {
      downKeyPressRef.current = true;
      socket.emit('handleKeyPressDown', isLeftPlayer);
      //if (position < 2) { // check if there is room to move down
      //}
    }
  };

  const handleKeyUp = (event) => {
    if (event.key === 'ArrowUp') {
      socket.emit('handleKeyRelUp', isLeftPlayer);
    } else if (event.key === 'ArrowDown') {
      socket.emit('handleKeyRelDown', isLeftPlayer);
      downKeyPressRef.current = false;
    }
  };

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
      //clearInterval(intervalId);
    };
  }, [isMovingUp, isMovingDown, isLeftPlayer]);

  return (
    <div
      style={{
        width: '500px',
        height: '300px',
        backgroundColor: 'lightblue',
        position: 'relative',
        margin: '50px auto',
        // padding: '20px',
      }}
    >
      <div
        style={{
          width: '50px',
          height: '100px',
          backgroundColor: 'brown',
          position: 'absolute',
          left: '10px',
          top: `${Math.max(Math.min(pos1, 4), -4) * 25 + 100}px`, // adjust the movement and limits here
        }}
      />

      <div
        style={{
          width: '50px',
          height: '100px',
          backgroundColor: 'brown',
          position: 'absolute',
          left: '100px',
          top: `${Math.max(Math.min(pos2, 4), -4) * 25 + 100}px`, // adjust the movement and limits here
        }}
      />


      <p>
        Press the up or down arrow key to move the wooden bar (restricted to -4
        to 4)
      </p>
      <p> {''+ isLeftPlayer} </p>
    </div>
  );
}

export default Game;
