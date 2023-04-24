import { useState } from 'react';

export function CreateChannelForm({ onCreateChannel }) {
  const [channelName, setChannelName] = useState('');
  const [channelKind, setChannelKind] = useState(0);
  const [channelPassword, setChannelPassword] = useState('');

  const handleNameChange = (event) => {
    setChannelName(event.target.value);
  };

  const handleKindChange = (event) => {
    setChannelKind(parseInt(event.target.value));
  };

  const handlePasswordChange = (event) => {
    setChannelPassword(event.target.value);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    console.log('createChannelForm 제출!')
    const data = {
      kind: channelKind,
      roomName: channelName,
      roomPassword: channelPassword,
    };
    onCreateChannel(data);
  };

  return (
    <form onSubmit={handleSubmit}>
      <label>
        Channel Name:
        <input type="text" value={channelName} onChange={handleNameChange} />
      </label>
      <br />
      <label>
        Channel Kind:
        <select value={channelKind} onChange={handleKindChange}>
          <option value={0}>Public</option>
          <option value={1}>Password Protected</option>
          <option value={2}>Private</option>
        </select>
      </label>
      <br />
      {channelKind === 1 && (
        <label>
          Channel Password:
          <input type="password" value={channelPassword} onChange={handlePasswordChange} />
        </label>
      )}
      <br />
      <button type="submit">Create Channel</button>
    </form>
  );
}
