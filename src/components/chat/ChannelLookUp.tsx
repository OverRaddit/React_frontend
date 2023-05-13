import { useMyContext } from 'MyContext';
import { MyChannel } from 'navigation/interfaces/Channel.interface';
import { useState, useEffect } from 'react';
import { Socket } from 'socket.io-client';
import { EventResponse } from '../../MyContext';

interface ChannelLookupProps {
  setChatHistory: (chatHistory: string[]) => void;
  setCurrentChatRoom: (room: string) => void;
  chatRooms: MyChannel[];
  setSelectedChannel: React.Dispatch<React.SetStateAction<string>>;
}

export function ChannelLookup({ setChatHistory, setCurrentChatRoom, chatRooms, setSelectedChannel,}: ChannelLookupProps) {
  const [filterKind, setFilterKind] = useState<string>('');
  const { myData, setMyData, friends, setFriends, channels, setChannels, mySocket, mapChannels, setMapChannels } = useMyContext();

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
    mySocket?.chatSocket?.emit('getChannel');
  };

  // const stateToMap = ([newKey, newValue]: [string, UserChatRoom]) => {
  //   const newMap = new Map<string, UserChatRoom>();
  //   userChatRooms.forEach((value, key) => {
  //     newMap.set(key, value);
  //   });

  //   newMap.set(newKey, newValue);
  //   setUserChatRooms(newMap);
  // };

  // Todo. 백에서 형식안맞춰 보내서 success값이 없음.
  // 반환받은 채널을 Mycontext channels에 포함시켜야 함.
  const handleJoinClick = (channelName: string) => {
    console.log(`Joining channel: ${channelName}`);
    setSelectedChannel(channelName);
    mySocket?.chatSocket?.emit('joinChannel', { roomName: channelName }, (response: EventResponse) => {
      console.log('joinChannel Response: ', response);
      if (!response.success) {
        console.log('An error occurred.');
        return;
      }
      // 이거 왜 추가가 안되냐;;
      const newChannel: MyChannel = response.data[0];

      //setChannels([newChannel]);
      //setCurrentChatRoom(newChannel.name);
      console.log('next Channels: ', [...channels, newChannel]);
      setChannels([...channels, newChannel]);
    });
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
          <td>{'-'}</td>
          <td>
            <button
              type="button"
              onClick={() => handleJoinClick(channel.name)}
            >
              Join
            </button>
          </td>
        </tr>
      ))}
    </tbody>
  </table>
</div>
	);
}
