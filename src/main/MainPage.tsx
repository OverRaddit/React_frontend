import React, { useEffect, useState, useContext, useRef } from 'react';
import { MyContext } from '../MyContext';
import './MainPage.css';
import { useNavigate } from 'react-router-dom';
import { Socket } from 'socket.io-client';
import { CreateChannelForm } from 'components/chat/createChannelForm';
import { ChannelLookup } from 'components/chat/ChannelLookUp';
import { MyChannel } from '../navigation/interfaces/interfaces';

interface Props {
    onShowNavigation: () => void;
  }

const MainPage: React.FC<Props> = ({ onShowNavigation }) => {
  const navigate = useNavigate();
  const [isInQueue, setIsInQueue] = useState<boolean>(false);
  const { myData, mySocket, channels } = useContext(MyContext);

  useEffect(() => {
    onShowNavigation();
    if (mySocket) {
      const handleEnqueueComplete = (state: number) => {
        if (state === 200) {
          console.log("queue에 삽입되었습니다.");
          setIsInQueue(true);
        }
      };
      const handleMatchingComplete = (res: any) => {
        console.log("여긴가", res);
        console.log(mySocket.gameSocket);

        setIsInQueue(false);
        navigate('/game', { state: { gameData: res } });
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
    console.log("test", myData);
    const intraId = myData?.intraid;
    const userId = myData?.id;
    mySocket?.gameSocket.emit('match', {gameType: 0, intraId:intraId, userId});
  };

  const joinExtendedQueue = () => {
    const intraId = myData?.intraid;
    const userId = myData?.id;
    mySocket?.gameSocket.emit('match', {gameType: 1, intraId:intraId, userId});
  };

  const cancelQueue = () => {
    console.log("Cancelling queue");
    mySocket?.gameSocket.emit('cancel queue', (res:any) =>{
      console.log(res);
      if (res.state === 200) {
        setIsInQueue(false);
	      document.body.classList.remove('modal-open');
      }
      console.log(res.message);
    });
  };

	const onCreateChannel = (data: any): void => {
		console.log('data: ', data);
		console.log('send onCreateChannel event');
		mySocket?.chatSocket.emit('createChannel', data);
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

