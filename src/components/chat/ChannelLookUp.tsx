// // import { channel } from 'diagnostics_channel';
// import { useState, useEffect } from 'react';

// export function ChannelLookup({ setChatHistory, setCurrentChatRoom, chatRooms, socket, userChatRooms, setUserChatRooms, setSelectedChannel }) {
//   const [filterKind, setFilterKind] = useState('');

//   const filteredChannels =
//     filterKind === ''
//       ? chatRooms
//       : chatRooms.filter((channel) => channel.kind === parseInt(filterKind));

//   const handleKindFilterChange = (event) => {
//     const kind = event.target.value;
//     setFilterKind(kind);
//   };

//   const handleLookupClick = () => {
//     const kind = filterKind !== '' ? parseInt(filterKind) : null;
//     socket.emit('getChannel');
//   };

// 	const stateToMap = ([newKey, newValue]) => {
// 		let newMap = new Map();
// 		userChatRooms.map = ([key, value]) => {
// 			newMap.set(key, value);
// 		}

// 		newMap.set(newKey, newValue);
// 		setUserChatRooms(newMap);
// 	}

//   const handleJoinClick = (channelName) => {
//     console.log(`Joining channel: ${channelName}`);
// 		setSelectedChannel(channelName);
//     socket.emit('joinChannel', { userId: socket.userId, roomName: channelName }, (response) => {
//       if (!response.success) {
//         console.log('Error가 발생했습니다.');
//         return ;
//       }
//     });
// 		setUserChatRooms(prev => new Map([...prev, [  channelName, 
// 			{
// 			kind: 0,
// 			roomname: channelName,
// 			owner: 'yson',
// 			chatHistory : [],
// 			}]
// 		]));
//   };

//   return (
//     <div>
//       <h2>Channel Lookup</h2>
//       <label>
//         Filter by Kind:
//         <select value={filterKind} onChange={handleKindFilterChange}>
//           <option value="">All</option>
//           <option value={0}>Public</option>
//           <option value={1}>Password Protected</option>
//           <option value={2}>Private</option>
//         </select>
//       </label>
//       <button type="button" onClick={handleLookupClick}>
//         Lookup
//       </button>
//       <table>
//         <thead>
//           <tr>
//             <th>Kind</th>
//             <th>Room Name</th>
//             <th>Owner</th>
//             <th>Room Password</th>
//             <th>Join</th>
//           </tr>
//         </thead>
//         <tbody>
//           {filteredChannels.map((channel, index) => (
//             <tr key={index}>
//               <td>{channel.kind}</td>
//               <td>{channel.name}</td>
//               {/* <td>{channel.owner}</td> */}
//               {/* <td>{channel.roompassword || '-'}</td> */}
//               <td>
//                 <button
//                   type="button"
//                   onClick={() => handleJoinClick(channel.roomname)}
//                 >
//                   Join
//                 </button>
//               </td>
//             </tr>
//           ))}
//         </tbody>
//       </table>
//     </div>
//   );
// }

import { MyChannel } from 'navigation/interfaces/Channel.interface';
import { useState, useEffect } from 'react';
import { Socket } from 'socket.io-client';

// interface Channel {
//   kind: number;
//   roomname: string;
//   owner: string;
//   roompassword?: string;
// }

// interface UserChatRoom {
//   kind: number;
//   roomname: string;
//   owner: string;
//   chatHistory: string[];
// }

// interface Socket {
//   userId: string;
//   emit: (event: string, data?: any, callback?: (response: any) => void) => void;
// }

interface ChannelLookupProps {
  setChatHistory: (chatHistory: string[]) => void;
  setCurrentChatRoom: (room: string) => void;
  chatRooms: MyChannel[];
  socket: Socket | undefined;
  userChatRooms: MyChannel[];
  setUserChatRooms: React.Dispatch<React.SetStateAction<MyChannel[]>>;
  setSelectedChannel: React.Dispatch<React.SetStateAction<string>>;
}

export function ChannelLookup({ setChatHistory, setCurrentChatRoom, chatRooms, socket, userChatRooms, setUserChatRooms, setSelectedChannel,}: ChannelLookupProps) {
  const [filterKind, setFilterKind] = useState<string>('');

  const filteredChannels =
    filterKind === ''
      ? chatRooms
      : chatRooms.filter((channel) => channel.kind === parseInt(filterKind));

  const handleKindFilterChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const kind = event.target.value;
    setFilterKind(kind);
  };

  const handleLookupClick = () => {
    const kind = filterKind !== '' ? parseInt(filterKind) : null;
    socket?.emit('getChannel');
  };

  // const stateToMap = ([newKey, newValue]: [string, UserChatRoom]) => {
  //   const newMap = new Map<string, UserChatRoom>();
  //   userChatRooms.forEach((value, key) => {
  //     newMap.set(key, value);
  //   });

  //   newMap.set(newKey, newValue);
  //   setUserChatRooms(newMap);
  // };

  const handleJoinClick = (channelName: string) => {
    console.log(`Joining channel: ${channelName}`);
    setSelectedChannel(channelName);
    socket?.emit('joinChannel', { userId: socket?.id, roomName: channelName }, (response: any) => {
      if (!response.success) {
        console.log('Error가 발생했습니다.');
        return;
      }
    });
    // setUserChatRooms((prev) => new Map([...prev, [channelName,
		// 	{
		// 		kind: 0,
		// 		roomname: channelName,
		// 		owner: 'yson',
		// 		chatHistory: [],
    // }]]));
  };

  return (
    <div>
      <h2>Channel Lookup</h2>
      <label>
        Filter by Kind:
        <select value={filterKind} onChange={handleKindFilterChange}>
          <option value="">All</option>
          <option value="0">Public</option>
          <option value="1">Password Protected</option>
          <option value="2">Private</option>
        </select>
      </label>
      <button type="button" onClick={handleLookupClick}>
        Lookup
      </button>
      <table>
        <thead>
          <tr>
            <th>Kind</th>
            <th>Room Name</th>
            <th>Owner</th>
            <th>Room Password</th>
            <th>Join</th>
          </tr>
        </thead>
        <tbody>
          {filteredChannels.map((channel, index) => (
            <tr key={index}>
          <td>{channel.kind}</td>
          <td>{channel.name}</td>
          {/* <td>{channel.roompassword || '-'}</td>
          <td>
            <button
              type="button"
              onClick={() => handleJoinClick(channel.roomname)}
            >
              Join
            </button>
          </td> */}
        </tr>
      ))}
    </tbody>
  </table>
</div>
	);
}