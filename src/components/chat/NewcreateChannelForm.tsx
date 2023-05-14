import { useMyContext } from 'MyContext';
import React, { useState, ChangeEvent, FormEvent } from 'react';
import { MyChannel } from 'navigation/interfaces/interfaces';

interface CreateChannelFormProps {}

export function CreateChannelForm(props: CreateChannelFormProps) {
  const [channelName, setChannelName] = useState('');
  const [channelKind, setChannelKind] = useState<number>(0);
  const [channelPassword, setChannelPassword] = useState('');
  const { setChannels, mySocket } = useMyContext();

  const handleNameChange = (event: ChangeEvent<HTMLInputElement>) => {
    setChannelName(event.target.value);
  };

  const handleKindChange = (event: ChangeEvent<HTMLSelectElement>) => {
    setChannelKind(parseInt(event.target.value));
  };

  const handlePasswordChange = (event: ChangeEvent<HTMLInputElement>) => {
    setChannelPassword(event.target.value);
  };

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault();
    const data = {
      kind: channelKind,
      roomName: channelName,
      roomPassword: channelPassword,
    };
    mySocket?.chatSocket.emit('createChannel', data, (response: { success: boolean; data: any[] }) => {
      if (!response.success) return;

      const newChannel: MyChannel = response.data[0];
      console.log('created Channel: ', newChannel);

      // Update channels with new channel
			// setChannels((prevChannels: MyChannel[]) => {
			// 	return [...prevChannels, newChannel];
			// });
    });
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
