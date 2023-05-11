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


	// type chatHistory = {
	// 	myArray: string[];
	// };
	
	const [currentChatHistory, setCurrentChatHistory] = useState<string[]>([]);
  const [currentChat, setCurrentChat] = useState('');
  const [chatRooms, setChatRooms] = useState<MyChannel[]>([]);
  const [userChatRooms, setUserChatRooms] = useState(channels);
  const [currentChatRoom, setCurrentChatRoom] = useState('gshimRoom');  // 현재 선택된 채널의 이름을 저장한다.
	const [isModalOpen, setIsModalOpen] = useState(false);
	const [modalMessage, setModalMessage] = useState('');
	const [selectedChannel, setSelectedChannel] = useState('');
	const chatHistoryRef = useRef(null); // new2

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
    console.log("joinNormalQueue function");
    const intraId = myData?.intraid;
    console.log("intraId:", intraId);
    console.log("gameSocket:", mySocket?.gameSocket);
    mySocket?.gameSocket.emit('match', {gameType: 0, intraId:intraId});
    console.log("joinNormalQueue function end");
  };

  const joinExtendedQueue = () => {
    console.log("Joining extended queue");
    const intraId = myData?.intraid;
    mySocket?.gameSocket.emit('match', {gameType: 1, intraId:intraId});
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
	
	const handleChatChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		setCurrentChat(e.target.value);
	};

	function findChannelByName(channels: MyChannel[], channelName: string): MyChannel | undefined {
		return channels.find((channel: MyChannel) => channel.name === channelName);
	}
	
	const handleChatSubmit = (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		if (currentChat.trim() !== '') {
			// setCurrentChatHistory((prevState) => ({
			// 	myArray: [...prevState.myArray, 'You: ' + currentChat],
			// }));
			setCurrentChatHistory([...currentChatHistory, 'You: ' + currentChat]);
			mySocket?.chatSocket.emit('chat', { roomName: currentChatRoom, message: currentChat });
			setCurrentChat('');
		}
	};

	const switchRoom = (event: React.ChangeEvent<HTMLSelectElement>): void => {
		// userChatRooms.get(currentChatRoom).chatHistory = currentChatHistory; // 방을 바꾸기 전 현재 채팅방의 채팅내역을 백업.
		const foundChannel = findChannelByName(channels, currentChatRoom);
		if (foundChannel)
		{
			foundChannel.chatHistory = currentChatHistory;
		}
		const selectedRoomName: string = event.target.value;
	
		setCurrentChatRoom(selectedRoomName);
		const newChannel = findChannelByName(channels, selectedRoomName);
		if (newChannel)
		{
			setCurrentChatHistory(newChannel.chatHistory);
		}
	};
	
	
	const leftChannel = (): void => {
		console.log('방나가기 이벤트');
		const data = {
			roomName: currentChatRoom,
			userId: myData?.id,
		};
		//console.log('data: ', data);
		mySocket?.chatSocket.emit('leftChannel', data, (message: string) => {
			console.log('leftChannel: ', message);
			setModalMessage(message);
			setIsModalOpen(true);
	
			const isError: boolean = true;
	
			// ㅇㅔ러가 발생한 경우
			if (isError) {
				return;
			}
	
			// 성공한 경우
	
			// 1. chatRooms에서 나간 채널을 삭제합니다.
	
			// 2. currentChatRoom을 chatRooms의 첫번째 방으로 재설정합니다.
		});
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

<button onClick={() => console.log('currentRoom : ', userChatRooms)}>currentRoom</button>
			<button onClick={() => console.log('currentChatHistory : ', currentChatHistory)}>currentChatHistory</button>
      <button onClick={() => console.log(myData)}>myData확인버튼</button>
      <h1>{userChatRooms.length === 0 ? "You are not join any room!" : currentChatRoom}</h1>
      <div className="x-page-top">
        <button>Normal Button</button>
        <button>Expand Button</button>
      </div>
      <hr></hr>
      <div className="x-page-bottom">
        <div
          className="chat-history-box"
          ref={chatHistoryRef}
        >
          {isModalOpen && (
            <div className="popup">
            <button className="close-button" onClick={() => setIsModalOpen(false)}>X</button>
            <h1>🚀 Modal 🚀</h1>
            <p className="scoreboard">{modalMessage}</p>
            {/* <Link to="/a">
              <button className="go-main" onClick={()=>{console.log('click!')}}>메인 화면으로 돌아가기</button>
            </Link> */}
            </div>
          )}
          <label>
            Channel Kind:
            <select value={currentChatRoom} onChange={switchRoom}>
						{
						// userChatRooms.map(([key, chatRoom]: [string, { roomname: string }]) => {
						// 	console.log('foreach chatRoom: ', chatRoom, key);
						// 	console.log('roomname: ', chatRoom.roomname);
						// 	return (
						// 		<option key={key} value={chatRoom.roomname}>
						// 			{chatRoom.roomname}
						// 		</option>
						// 	);
						// })
						}
            </select>
            {/* <button onClick={leftChannel}>방나가기</button> */}
          </label>
          <ul>
            {/* {currentChatHistory.map((chat, index) => (
              <li key={index}>{chat}</li>
            ))} */}
          </ul>
        </div>
        <form onSubmit={handleChatSubmit}>
          <input
            className='chat-input-box'
            type="text"
            value={currentChat}
            onChange={handleChatChange}
            placeholder="Type your chat here"
          />
          <button type="submit">Send</button>
        </form>

        {/* { true ?
          <>
            <h3>Make your own</h3>
            <CreateChannelForm setChatHistory={setCurrentChatHistory} setCurrentChatRoom={setCurrentChatRoom} onCreateChannel={onCreateChannel}/>
          </>
          : <h3>you can't make room now!</h3>
        } */}

        <ChannelLookup setChatHistory={setCurrentChatHistory} setCurrentChatRoom={setCurrentChatRoom} socket={mySocket?.chatSocket} chatRooms={chatRooms} userChatRooms={userChatRooms} setUserChatRooms={setUserChatRooms} setSelectedChannel={setSelectedChannel}/>
      </div>

    </div>
  );
};

export default MainPage;

