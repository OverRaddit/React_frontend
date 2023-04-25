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
    socket.emit('joinChannel', { roomName: channelName });

    // joinChannel이 성공했다면 아래가 실행되어야 한다!!!!! 고쳐야함.
    setChatHistory([]);
    setCurrentChatRoom(channelName);
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
