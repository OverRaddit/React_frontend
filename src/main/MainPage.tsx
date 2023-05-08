import React, { useEffect, useState, useContext } from 'react';
import { MyContext } from '../MyContext'; 
import './MainPage.css';
import { useNavigate } from 'react-router-dom';
import { Socket } from 'socket.io-client';

interface Props {
    onShowNavigation: () => void;
  }

const MainPage: React.FC<Props> = ({ onShowNavigation }) => {
  const navigate = useNavigate();
  const [isInQueue, setIsInQueue] = useState<boolean>(false);
  const [isExQueue, setIsExQueue] = useState<boolean>(false);
  const { myData, mySocket } = useContext(MyContext);

  useEffect(() => {
    onShowNavigation();
    if (mySocket) {
        console.log("TEST");
        const handleEnqueueComplete = (state: number) => {
            if (state === 200) {
              console.log("queue에 삽입되었습니다.");
              // gameSocket.status = "in-queue";s
              // gameSocket.emit('status', gameSocket.status);
              setIsInQueue(true);
            }
          };
          const handleMatchingComplete = () => {
            setIsInQueue(false);
            navigate('/game');
          };
      
          mySocket.gameSocket.on('enqueuecomplete', handleEnqueueComplete);
          mySocket.gameSocket.on('matchingcomplete', handleMatchingComplete);
      
          return () => {
            mySocket.gameSocket.off('enqueuecomplete');
            mySocket.gameSocket.off('matchingcomplete');
          };
    }
  }, [mySocket]);

  const joinNormalQueue = () => {
    console.log("Joining normal queue");
    const nickName = myData?.intraid;
    console.log(mySocket?.gameSocket);
    mySocket?.gameSocket.emit('match', {gameType: 0, nickName});
    setIsExQueue(false);
  };

  const joinExtendedQueue = () => {
    console.log("Joining extended queue");
    const nickName = myData?.intraid;
    mySocket?.gameSocket.emit('match', {gameType: 1, nickName});
    setIsExQueue(true);
  };

  const cancelQueue = () => {
    console.log("Cancelling queue");
    const isExtendedQueue = isExQueue;
    mySocket?.gameSocket.emit('cancel queue', isExtendedQueue);
    setIsInQueue(false);
  };

  return (
    <div className="main-page">
      <div className="button-container">
        <button className="queue-button" onClick={joinNormalQueue}>기본</button>
        <button className="queue-button" onClick={joinExtendedQueue}>확장</button>
      </div>

      {isInQueue && (
        <>
          <div className="overlay"></div>
          <div className="queue-popup">
            <h1>Finding new opponent..</h1>
            <button className="cancel-button" onClick={cancelQueue}>매칭 취소하기</button>
          </div>
        </>
      )}
    </div>
  );
};

export default MainPage;

