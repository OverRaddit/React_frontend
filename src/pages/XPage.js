// import React, { useState, useRef, useEffect } from 'react';
// import './XPage.css'
// import { CreateChannelForm } from 'components/chat/createChannelForm';
// import { ChannelLookup } from 'components/chat/ChannelLookUp';
// import { useMyContext } from 'MyContext';

// const XPage = () => {
//   const [currentChat, setCurrentChat] = useState('');
//   const [chatRooms, setChatRooms] = useState([]);
//   const { myData, setMyData, friends, setFriends, channels, setChannels, mySocket, mapChannels, setMapChannels, currentChannel, setCurrentChannel } = useMyContext();
//   const [userChatRooms, setUserChatRooms] = useState(channels);

//   const [isModalOpen, setIsModalOpen] = useState(false);
//   const [modalMessage, setModalMessage] = useState('');
// 	const [selectedChannel, setSelectedChannel] = useState('');

//   const chatHistoryRef = useRef(null); // new2

//   useEffect(() => {
//     console.log('channels: ', channels);
//     if (channels.length === 0) return;

//     if (!currentChannel) {
//       setCurrentChannel(channels[0]);
//     }
//     else
//       setCurrentChannel(channels.find((channel) => channel.name === currentChannel?.name));
//   }, [channels, currentChannel, setCurrentChannel]);


//   useEffect(() => {
//     const chatHistoryBox = chatHistoryRef.current;
//     const gap = chatHistoryBox.scrollHeight - chatHistoryBox.scrollTop
//     console.log('gap: ', gap);
//     if (gap < 230)
//       chatHistoryBox.scrollTop = chatHistoryBox.scrollHeight;
//   }, [currentChannel?.chatHistory]);

//   const handleChatChange = (e) => {
//     setCurrentChat(e.target.value);
//   };

//   const handleChatSubmit = (e) => {
//     e.preventDefault();
//     if (currentChat.trim() !== '') {
//       const targetRoom = currentChannel?.kind === 3 ? currentChannel?.owner.id : currentChannel.name;
//       console.log('targetRoom: ', targetRoom);
//       mySocket.chatSocket.emit('chat', { roomName: targetRoom, message: currentChat});

//     // 내 채팅을 채널의 채팅목록에 추가하는 코드===================
//       const channelIndex = channels.findIndex(channel => channel.name === currentChannel.name);
//       console.log('channelIndex: ', channelIndex);

//       if (channelIndex !== -1) {
//         const updatedChannel = {
//           ...channels[channelIndex],
//           chatHistory: [...channels[channelIndex].chatHistory, 'You: ' + currentChat]
//         };

//         const updatedChannels = [
//           ...channels.slice(0, channelIndex),
//           updatedChannel,
//           ...channels.slice(channelIndex + 1)
//         ];

//         console.log('updatedChannels: ', updatedChannels);
//         setChannels(updatedChannels);
//       }
//     // 내 채팅을 채널의 채팅목록에 추가하는 코드===================
//       setCurrentChat('');
//     }
//   };

//   const leftChannel = () => {
//     console.log('방나가기 이벤트');
//     const data = {
//       "roomName": currentChannel.name,
//     };
//     mySocket.chatSocket.emit('leftChannel', data, (response)=> {
//       console.log('leftChannel: ', response);
//       setModalMessage(response.message);
//       setIsModalOpen(true);

//       // ㅇㅔ러가 발생한 경우
//       if (!response.success) return;

//       // 성공한 경우
//       setChannels(channels.filter((channel) => channel.name !== currentChannel.name));
//       //1. chatRooms에서 나간 채널을 삭제합니다.
//       //2. currentChatRoom을 chatRooms의 첫번째 방으로 재설정합니다.
//     });
//   }

// 	const switchRoom = (event) =>
// 	{
//     console.log('switchRoom] chathistory: ');
//     console.log('switchRoom] channels:', channels);

//     // 선택한 channel의 대화목록을 불러오기
//     const selectedRoomName = event.target.value;
//     const selectedChannel = channels.find((channel) => channel.name === selectedRoomName);
//     setCurrentChannel(selectedChannel);
//   }

//   const debugAllState = () => {
//     console.log('---------------------------------------------');
//     console.log('currentChatHistory: ', currentChannel.chatHistory);
//     console.log('currentChannel: ', currentChannel);
//     console.log('channels: ', channels);
//     console.log('selectedChannel: ', selectedChannel);
//     console.log('---------------------------------------------');
//   }

//   const handleDM = () => {
//     mySocket.chatSocket.emit('createDm', { userId: 2 }, (response) => {
//       console.log(response);
//       setChannels([...channels, response.data[0]]);
//     });
//   }

//   return (
//     <div className="x-page">
// 			<button onClick={debugAllState}>debugAllState</button>
// 			<button onClick={handleDM}>channels</button>
// 			<button onClick={() => console.log('channels : ', channels)}>channels</button>
// 			<button onClick={() => console.log('currentRoom : ', currentChannel)}>currentRoom</button>
// 			<button onClick={() => console.log('selectedRoomHistory : ', channels.find((channel) => channel.name === selectedChannel))}>currentChannel ChatHistory</button>
// 			<button onClick={() => console.log('currentChatHistory : ', currentChannel.chatHistory)}>currentChatHistory</button>
//       <button onClick={() => console.log(myData)}>myData확인버튼</button>
//       <h1>{channels.size === 0 ? "You are not join any room!" : currentChannel?.name}</h1>
//       <div className="x-page-top">
//         <button>Normal Button</button>
//         <button>Expand Button</button>
//       </div>
//       <hr></hr>
//       <div className="x-page-bottom">
//         <div
//           className="chat-history-box"
//           ref={chatHistoryRef}
//         >
//           {isModalOpen && (
//             <div className="popup">
//             <button className="close-button" onClick={() => setIsModalOpen(false)}>X</button>
//             <h1>🚀 Modal 🚀</h1>
//             <p className="scoreboard">{modalMessage}</p>
//             {/* <Link to="/a">
//               <button className="go-main" onClick={()=>{console.log('click!')}}>메인 화면으로 돌아가기</button>
//             </Link> */}
//             </div>
//           )}
//           <label>
//             채팅방 목록:
//             <select value={currentChannel?.name} onChange={switchRoom}>
//               {channels.map((channel) => {
//                 return (
//                   <option key={channel.name} value={channel.name}>
//                     {channel.name}
//                   </option>
//                 );
//               })}
//             </select>
//             <button onClick={leftChannel}>방나가기</button>
//           </label>
//           <ul>
//             {currentChannel?.chatHistory?.map((chat, index) => (
//               <li key={index}>{chat}</li>
//             ))}
//           </ul>
//         </div>
//         <form onSubmit={handleChatSubmit}>
//           <input
//             className='chat-input-box'
//             type="text"
//             value={currentChat}
//             onChange={handleChatChange}
//             placeholder="Type your chat here"
//           />
//           <button type="submit">Send</button>
//         </form>

//         { true ?
//           <>
//             <h3>Make your own</h3>
//             <CreateChannelForm />
//           </>
//           : <h3>you can't make room now!</h3>
//         }

//         <ChannelLookup chatRooms={chatRooms} setSelectedChannel={setSelectedChannel}/>
//       </div>
//     </div>
//   );
// };

// export default XPage;
