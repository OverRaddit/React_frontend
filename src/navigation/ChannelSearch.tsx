import React, { useState } from 'react';
import Modal from 'react-modal';
import './ChannelSearch.css';

type ChannelType = 'public' | 'protected' | 'private';

interface Channel {
  id: string;
  name: string;
  owner: string;
  type: ChannelType;
  password?: string;
}

const ChannelSearch = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [channels, setChannels] = useState<Channel[]>([]);
  const [newChannelName, setNewChannelName] = useState('');
  const [newChannelType, setNewChannelType] = useState<ChannelType>('public');
  const [newChannelPassword, setNewChannelPassword] = useState('');

  const openModal = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const handleChannelCreation = () => {
    const newChannel: Channel = {
      id: Date.now().toString(),
      name: newChannelName,
      owner: 'You',
      type: newChannelType,
    };

    if (newChannel.type === 'protected') {
      newChannel.password = newChannelPassword;
    }

    setChannels([...channels, newChannel]);
    setNewChannelName('');
    setNewChannelType('public');
    setNewChannelPassword('');
    closeModal();
  };

  return (
    <div className="ChannelSearch">
      <button onClick={openModal}>Channel Search</button>
      <Modal
        isOpen={isModalOpen}
        onRequestClose={closeModal}
        contentLabel="Channel Search Modal"
        className="channel-search-modal"
        overlayClassName="channel-search-overlay"
      >
        <h2>Search Channels</h2>
        <ul>
          {channels.length > 0 ? (
            channels.map((channel) => (
              <li key={channel.id}>
                {channel.type === 'protected' ? '🔒' : ''}
                {channel.name} (owner: {channel.owner})
                <button>Join</button>
              </li>
            ))
          ) : (
            <p>현재 입장할 수 있는 방이 없습니다.</p>
          )}
        </ul>
        <div>
          <h3>Create Channel</h3>
          <input
            type="text"
            placeholder="Channel name"
            value={newChannelName}
            onChange={(e) => setNewChannelName(e.target.value)}
          />
          <select
            value={newChannelType}
            onChange={(e) => setNewChannelType(e.target.value as ChannelType)}
          >
            <option value="public">Public</option>
            <option value="protected">Protected</option>
            <option value="private">Private</option>
          </select>
          {newChannelType === 'protected' && (
            <input
              type="password"
              placeholder="Password"
              value={newChannelPassword}
              onChange={(e) => setNewChannelPassword(e.target.value)}
            />
          )}
          <button onClick={handleChannelCreation}>Create Channel</button>
        </div>
      </Modal>
    </div>
  );
};

export default ChannelSearch;
