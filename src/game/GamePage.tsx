import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import './GamePage.css';
import { useNavigate, useLocation } from 'react-router-dom';
import { EventResponse, useMyContext } from 'MyContext';
import { drawRect, drawCircle, drawText, drawCircleBall } from './painting';
import { GameWindow } from 'UserProfile/GameWidow';
import { GameModal } from 'UserProfile/GameModal';


const canvasMaxWidth = 600;
const canvasMaxHeight = 400;
const net = {
  x: canvasMaxWidth / 2 - 1,
  y: 0,
  width: 2,
  height: 10,
  color: 'WHITE',
};

interface Props {
  onHideNavigation: () => void;
}

function Game({ onHideNavigation }: Props) {
  const navigate = useNavigate();
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const [playerId, setPlayerId] = useState(0);
  const [pos1, setPos1] = useState({ x: 0, y: 0, width: 0, height: 0, score: 0 });
  const [pos2, setPos2] = useState({ x: 0, y: 0, width: 0, height: 0, score: 0 });
  const [ball, setBall] = useState({ x: 0, y: 0, radius: 0 });
  const [keyDown, setKeyDown] = useState(false);
  const [gameMode, setGameMode] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false);
	const [modalMessage, setModalMessage] = useState('');

  const location = useLocation();
  const { mySocket, myData } = useMyContext();
  const gameData = location.state?.gameData.dataObject;
  const windowKeyDownHandler = (e: KeyboardEvent) => {
    handleKeyDown(e as unknown as React.KeyboardEvent<HTMLDivElement>);
  };
  const windowKeyUpHandler = (e: KeyboardEvent) => {
    handleKeyUp(e as unknown as React.KeyboardEvent<HTMLDivElement>);
  };
  const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (!keyDown) {
      if (e.key === 'ArrowUp') {
        // //console.log('Player: ', gameData.roomName, playerId, "press up");
        mySocket?.gameSocket.emit('handleKeyPressUp', { roomName: gameData.roomName, id: playerId });
      } else if (e.key === 'ArrowDown') {
        // //console.log('Player: ', gameData.roomName, playerId, "press down");
        mySocket?.gameSocket.emit('handleKeyPressDown', { roomName: gameData.roomName, id: playerId });
      }
      setKeyDown(true);
    }
  };
  const handleKeyUp = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (e.key === 'ArrowUp') {
      // //console.log('Player: ', gameData.roomName, playerId, "relese up");
      mySocket?.gameSocket.emit('handleKeyRelUp', { roomName: gameData.roomName, id: playerId });
    } else if (e.key === 'ArrowDown') {
      // //console.log('Player: ', gameData.roomName, playerId, "relese down");
      mySocket?.gameSocket.emit('handleKeyRelDown', { roomName: gameData.roomName, id: playerId });
    }
    setKeyDown(false);
  };

  function render(ctx: CanvasRenderingContext2D | null) {
    drawRect(0, 0, canvasMaxWidth, canvasMaxHeight, 'BLACK', ctx);
    drawRect(pos1.x, pos1.y, pos1.width, pos1.height, 'WHITE', ctx);
    drawRect(pos2.x, pos2.y, pos2.width, pos2.height, 'WHITE', ctx);

    // draw the net
    for (let i = 0; i <= canvasMaxHeight; i += 15)
      drawRect(net.x, net.y + i, net.width, net.height, net.color, ctx);

    // draw score
    drawText(pos1.score, canvasMaxWidth / 4, canvasMaxHeight / 5, "WHITE", ctx);
    drawText(pos2.score, 3 * canvasMaxWidth / 4, canvasMaxHeight / 5, "WHITE", ctx);

    drawCircleBall(gameMode, ball, ctx);
  }

  const backToMain = () => {
    navigate('/', { replace: true });
  };

  function getCurrentUsername(player: number): string {
    if (player == 1)
      return gameData.leftUser.intraid;
    else if (player == 2)
      return gameData.rightUser.intraid;
    return 'error : wrong playerID';
  }

  // Prevent continuous keystrokes  // TODO: (gshim)님한테 체크 받아야 할 부분. key눌림 방지
  useEffect(() => {
  }, [keyDown]);

  // register 'render' event and set left or right
  useEffect(() => {
    onHideNavigation();
    if (!mySocket) {
      // window.alert('잘못된 접근입니다.');
      navigate('/', { replace: true });
      return;
    }
    if (mySocket?.gameSocket.id === gameData.leftSockId)
      setPlayerId(1);
    else if (mySocket?.gameSocket.id === gameData.rightSockId)
      setPlayerId(2);
    else
      setPlayerId(42);
    setGameMode(gameData.gameType); // TODO: (gshim)님한테 체크 받아야 할 부분. 게임 모드 설정.

		mySocket?.gameSocket.on('gameover', (data) => {
      const { state, message, dataObject } = data;
      const { player } = dataObject;
      if (state == 200) {
        setIsModalOpen(true);
        mySocket.chatSocket.emit('state', { userId: myData?.id, status: 'online' }, (response: EventResponse) => {
          // //console.log('state: ', response);
        })
				const msg = player + ' wins!';
				setModalMessage(msg);
      }
    });

    mySocket?.gameSocket.on('render', (pos1: any, pos2: any, ball: any) => {
      setPos1(pos1);
      setPos2(pos2);
      setBall(ball);
    });

    window.onpopstate = (event: PopStateEvent) => {
      let player = 0;

      if (mySocket?.gameSocket.id === gameData.leftSockId)
        player = 1;

      else
        player = 2;
      mySocket?.gameSocket.emit('playerBackspace', { roomName: gameData.roomName, nickName: getCurrentUsername(player) });
      backToMain();
    };

    return () => {
      mySocket?.gameSocket.off('render');
			mySocket?.gameSocket.off('gameover');
    };
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas)
      return;
    const ctx = canvas!.getContext('2d');

    window.addEventListener('keydown', windowKeyDownHandler);
    window.addEventListener('keyup', windowKeyUpHandler);

    render(ctx);
    return () => {
      window.removeEventListener('keydown', windowKeyDownHandler);
      window.removeEventListener('keyup', windowKeyUpHandler);
    };
  }, [pos1, pos2, ball, onHideNavigation]);

  return (
    (mySocket?.gameSocket &&
      <div className='game-ui'>
        <div className='canvas-container'>
          <canvas ref={canvasRef} width={canvasMaxWidth} height={canvasMaxHeight} />
          <GameModal isModalOpen={isModalOpen} setIsModalOpen={setIsModalOpen} navigate={navigate} firstScore={pos1.score} secondScore={pos2.score} modalMessage={modalMessage}></GameModal>
					<p>패들을 이동해서 공을 상대에게 보내세요. 상대가 공을 받지 못하게 해서 점수를 얻을 수 있습니다. 5점을 먼저 얻으면 승리합니다!</p>
        </div>
        <div className='game-window-container'>
          <GameWindow leftUser={gameData.leftUser} rightUser={gameData.rightUser}></GameWindow>
        </div>
      </div>
    )
  );
}

export default Game;
