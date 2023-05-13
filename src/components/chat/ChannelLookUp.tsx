import { useState, useEffect } from 'react';
import { useMyContext } from 'MyContext';
import { MyChannel } from 'navigation/interfaces/Channel.interface';

interface EventResponse {
  success: boolean;
  message: string;
  data: any[];
}

export function ChannelLookup({
  chatRooms,
  setSelectedChannel,
}: {
  chatRooms: MyChannel[];
  setSelectedChannel: Function;
}) {
  const [filterKind, setFilterKind] = useState('');
	const { myData, channels, setChannels, mySocket, setCurrentChannel } = useMyContext();
  const [channelList, setChannelList] = useState<MyChannel[]>([]);

  useEffect(() => {
    mySocket?.chatSocket.on('getChannel', (response: MyChannel[]) => {
      console.log('getChannel: ', response);
      setChannelList(response);
    });
  }, [mySocket?.chatSocket]);

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
    console.log('handleLookupClick!~');
    mySocket?.chatSocket.emit('getChannel', (response: Response) => {
      console.log('getChannel Response: ', response);
    });
  };

  const handleJoinClick = (channelName: string) => {
    console.log(`Tried to join channel: ${channelName}`);
    mySocket?.chatSocket?.emit('joinChannel', { userId: myData?.id, roomName: channelName }, (response: EventResponse) => {
      console.log('joinChannel Response: ', response);
      if (!response.success) {
        console.log('An error occurred.');
        return;
      }

      // 이게 정확히 무슨 state지?
      setSelectedChannel(channelName);

      // 이거 왜 추가가 안되냐;;
      const newChannel = response.data[0];
      newChannel.setChatHistory = [];
      newChannel.showUserList = false;

      //setChannels([newChannel]);
      console.log('next Channels: ', [...channels, newChannel]);
      setChannels([...channels, newChannel]);
			setCurrentChannel(newChannel);
    });
  };

  return (
    <div>
      <h2>Gshim's Channel Lookup</h2>
      <label>
        Filter by Kind:
        <select value={filterKind} onChange={handleKindFilterChange}>
          <option value="">All</option>
          <option value="0">Public</option>
          <option value="1">Password Protected</option>
          <option value          ={2}>Private</option>
        </select>
      </label>
      <button type="button" onClick={handleLookupClick}>
        Lookup
      </button>
      <table>
        <thead>
          <tr>
            <th>Kind</th>
            <th>Room_Name</th>
            <th>Owner</th>
            <th>Room_Password</th>
            <th>Join</th>
          </tr>
        </thead>
        <tbody>
          {channelList.map((channel, index) => (
            <tr key={index}>
              <td>{channel.kind}</td>
              <td>{channel.name}</td>
              <td>{channel.owner}</td>
              <td>{channel.roompassword || '-'}</td>
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

