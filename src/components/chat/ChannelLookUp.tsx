import { useState, useEffect } from 'react';
import { useMyContext } from 'MyContext';
import { MyChannel } from 'navigation/interfaces/Channel.interface';
import './ChannelLookUp.css'

interface EventResponse {
  success: boolean;
  message: string;
  data: any[];
}

export function ChannelLookup({
  chatRooms,
}: {
  chatRooms: MyChannel[];
}) {
  const [filterKind, setFilterKind] = useState('');
	const { myData, channels, setChannels, mySocket, setCurrentChannel } = useMyContext();
  const [channelList, setChannelList] = useState<MyChannel[]>([]);
	const [passwordInput, setPasswordInput] = useState('');
	const [passwordModal, setPasswordModal] = useState(false);
	const [selectedChannelName, setSelectedChannelName] = useState('');

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

  const handleJoinClick = (channelKind: number, channelName: string) => {
		if (channelKind === 1) {
			setPasswordModal(true);
			setSelectedChannelName(channelName);
			return ;
		}
    console.log(`Tried to join channel: ${channelName}`);
    mySocket?.chatSocket?.emit('joinChannel', { userId: myData?.id, roomName: channelName, roomPassword: passwordInput }, (response: EventResponse) => {
      console.log('joinChannel Response: ', response);
      if (!response.success) {
        console.log('An error occurred.');
        return;
      }

      // 이거 왜 추가가 안되냐;;
      const newChannel = response.data[0];
      newChannel.setChatHistory = [];
      newChannel.showUserList = false;

      //setChannels([newChannel]);
      console.log('next Channels: ', [...channels, newChannel]);
      setChannels([...channels, newChannel]);
			setCurrentChannel(newChannel);
			setSelectedChannelName('');
    });
  };

	const confirmPassword = () => {
		setPasswordModal(false);
		if (passwordInput == '')
		{
			console.log('You should input password!');
			return ;
		}
		handleJoinClick(0, selectedChannelName);
	}

	const handlePasswordInput = (event: React.ChangeEvent<HTMLInputElement>) => {
		setPasswordInput(event.target.value);
	};

  return (
		<>
    <div>
      <h2>Channel Lookup</h2>
      <table>
        <thead>
          <tr>
            <th>Kind</th>
            <th>Room_Name</th>
            <th>Owner</th>
            <th>Join</th>
						<button type="button" onClick={handleLookupClick}>↻</button>
          </tr>
        </thead>
        <tbody>
          {channelList.map((channel, index) => (
            <tr key={index}>
              <td>{channel.kind}</td>
              <td>{channel.name}</td>
              <td>{channel.owner}</td>
              <td>
                <button
                  type="button"
                  onClick={() => handleJoinClick(channel.kind, channel.name)}
                >
                  Join
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
		{passwordModal && (
			<div className="popup">
			  <label>Room Password: </label>
        <input type="password" value={passwordInput} onChange={handlePasswordInput}></input>
				<div className='buttons'>
					<button onClick={() => confirmPassword()}>확인</button>
					<button className='closeButton' onClick={() => setPasswordModal(false)}>X</button>
				</div>
			</div>
		  )}
	</>
  );
}

