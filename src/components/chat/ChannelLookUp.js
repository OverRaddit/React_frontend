import { useState } from 'react';

export function ChannelLookup({ setChatHistory, setCurrentChatRoom, chatRooms, socket }) {
  const [filterKind, setFilterKind] = useState('');

  const filteredChannels =
    filterKind === ''
      ? chatRooms
      : chatRooms.filter((channel) => channel.kind === parseInt(filterKind));

  const handleKindFilterChange = (event) => {
    const kind = event.target.value;
    setFilterKind(kind);
  };

  const handleLookupClick = () => {
    const kind = filterKind !== '' ? parseInt(filterKind) : null;
    socket.emit('getChannel');
  };

  const handleJoinClick = (channelName) => {
    console.log(`Joining channel: ${channelName}`);
    socket.emit('joinChannel', { userId: socket.userId, roomName: channelName }, (response) => {
      if (!response.success) {
        console.log('Error가 발생했습니다.');
        return ;
      }
      // 참여한 채널목록 map에 channelName과 channelName 채팅목록 배열을 추가합니다.

      // 입장한 채널의 채팅목록을 ChatHistory에 set합니다.
      setChatHistory([]);

      // 입장한 채널의 이름을 CurrentChatRoom에 최신화합니다.
      setCurrentChatRoom(channelName);
    });
  };

  return (
    <div>
      <h2>Channel Lookup</h2>
      <label>
        Filter by Kind:
        <select value={filterKind} onChange={handleKindFilterChange}>
          <option value="">All</option>
          <option value={0}>Public</option>
          <option value={1}>Password Protected</option>
          <option value={2}>Private</option>
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
              <td>{channel.roomname}</td>
              <td>{channel.owner}</td>
              <td>{channel.roompassword || '-'}</td>
              <td>
                <button
                  type="button"
                  onClick={() => handleJoinClick(channel.roomname)}
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
