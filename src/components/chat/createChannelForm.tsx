import { useMyContext } from 'MyContext';
import React, { useState, ChangeEvent, FormEvent } from 'react';
import { MyChannel } from 'navigation/interfaces/interfaces';

interface CreateChannelFormProps {}

export function CreateChannelForm(props: CreateChannelFormProps) {
  const [channelName, setChannelName] = useState('');
  const [channelKind, setChannelKind] = useState<number>(0);
  const [channelPassword, setChannelPassword] = useState('');
  const { setChannels, mySocket, channels } = useMyContext();

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
		if (data.kind == 1 && data.roomPassword == '')
		{
			//console.log('You can\'t put void Password');
			return ;
		}
    mySocket?.chatSocket.emit('createChannel', data, (response: { success: boolean; data: any[] }) => {
      if (!response.success) return;

      const newChannel: MyChannel = response.data[0];
      //console.log('created Channel: ', newChannel);
			//TODO : prevChannels를 사용하는 구조로 변경 필요, 현재는 임시로
			setChannels([...channels, newChannel]);

			// setChannels((prevChannels: MyChannel[]) => {
			// 	return [...prevChannels, newChannel];
			// });
			setChannelName('');
    });
  };

  return (
    <form onSubmit={handleSubmit}>
			<h2>Search Channel</h2>
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
