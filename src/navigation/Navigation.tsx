import { FC } from 'react';
import { useState } from 'react';
import { Link } from 'react-router-dom';
import Modal from 'react-modal';
import Channel from './interfaces/Channel.interface';
import Friend from './interfaces/Friend.interface';
import './Navigation.css';

type ListName = 'friends' | 'channels';

const channelList: Channel[] = [
  {
    id: '1',
    name: 'Channel 1',
    users: [
      { id: 'u1', name: 'User 1' },
      { id: 'u2', name: 'User 2' },
    ],
  },
  {
    id: '2',
    name: 'Channel 2',
    users: [
      { id: 'u3', name: 'User 3' },
      { id: 'u4', name: 'User 4' },
    ],
  },
];

const Navigation: FC = () => {
  const [showList, setShowList] = useState<ListName>('friends');                    // friends, channels toggle
  const [expandedChannels, setExpandedChannels] = useState<Set<number>>(new Set()); // ??
  const [channels, setChannels] = useState(channelList);                            // channel list
  const [isModalOpen, setIsModalOpen] = useState(false);                            // open modal or not
  const [channelToLeave, setChannelToLeave] = useState<Channel | null>(null);       // ??

  const openModal = (channel: Channel) => {
    setChannelToLeave(channel);
    setIsModalOpen(true);
  };

  const confirmLeave = () => {
    if (channelToLeave) {
      setChannels(channels.filter((channel) => channel.id !== channelToLeave.id));
    }
    setIsModalOpen(false);
  };

  const handleLeaveChannel = (channelId: any) => {
    const confirmLeave = window.confirm('Are you gonna leave?');
    if (confirmLeave) {
      setChannels(channels.filter(channel => channel.id !== channelId));
    }
  };

  const toggleUserList = (channelId: string) => {
    setChannels((prevChannelList) =>
      prevChannelList.map((channel) =>
        channel.id === channelId
          ? { ...channel, showUserList: !channel.showUserList }
          : channel
      )
    );
  };

  const renderChannelList = () => {
    return (
      <ul className="channel-list">
        {channels.map((channel) => (
          <li key={channel.id} className="channel">
            <div className="channel-info">
              <span>{channel.name}</span>
              <button onClick={() => toggleUserList(channel.id)}>+</button>
              <button
                className="leave-channel-btn"
                onClick={() => openModal(channel)}
              >
                Leave
              </button>
            </div>
            {channel.showUserList && (
              <ul className="user-list">
                {channel.users.map((user : any) => (
                  <li key={user.id}>{user.name}</li>
                ))}
              </ul>
            )}
          </li>
        ))}
      </ul>
    );
  };

  const handleListSwitch = (listName: ListName) => {
    setShowList(listName);
  };

  const toggleChannelExpansion = (index: number) => {
    const newExpandedChannels = new Set(expandedChannels);
    if (newExpandedChannels.has(index)) {
      newExpandedChannels.delete(index);
    } else {
      newExpandedChannels.add(index);
    }
    setExpandedChannels(newExpandedChannels);
  };

  const renderFriendsList = () => {
    const friends: Friend[] = Array.from({ length: 10 }, (_, i) => ({
      name: `Friend ${i + 1}`,
      status: i % 3 === 0 ? 'online' : i % 3 === 1 ? 'in-game' : 'offline',
    }));

    const sortedFriends = friends.sort((a, b) => {
      if (a.status === b.status) return a.name.localeCompare(b.name);
      if (a.status === 'online') return -1;
      if (b.status === 'online') return 1;
      if (a.status === 'in-game') return -1;
      if (b.status === 'in-game') return 1;
      return 0;
    });

    return (
      <ul className="friends-list">
        {sortedFriends.map((friend, index) => (
          <li key={index} className="friend">
            <span>{friend.name} ({friend.status})</span>
          </li>
        ))}
      </ul>
    );
  };

  const handleFriendClick = (friendId: any) => {
    // Show related menu
  };

  const handleChannelSearch = (searchQuery: any) => {
    // Implement channel search
  };

  return (
    <div className="Navigation" id="navigation">
      {/* Profile row */}
      <div className="profile-row">
        <img className="profile-picture" src="profile_picture_url" alt="Profile" />
        <span>Nickname</span>
      </div>

      {/* Button group */}
      <div className="button-group">
        <Link to="/a"><button>X</button></Link>
        <Link to="/game"><button>Y</button></Link>
        <Link to="/c"><button>Z</button></Link>
        <button onClick={() => handleListSwitch('friends')}>Friends</button>
        <button onClick={() => handleListSwitch('channels')}>Channels</button>
      </div>

      {/* List rendering */}
      <>
        {showList === 'friends' && renderFriendsList()}
        {showList === 'channels' && renderChannelList()}
      </>

      {/* Channel search */}
      <div className="search-container">
        <input
          type="text"
          placeholder="Search channels"
          onChange={(e) => handleChannelSearch(e.target.value)}
        />
      </div>
      <Modal
        isOpen={isModalOpen}
        onRequestClose={() => setIsModalOpen(false)}
        contentLabel="Leave Channel Modal"
      >
        <h2>Are you sure you want to leave the channel?</h2>
        <button onClick={confirmLeave}>Yes</button>
        <button onClick={() => setIsModalOpen(false)}>No</button>
      </Modal>
    </div>
  );
};

export default Navigation;
