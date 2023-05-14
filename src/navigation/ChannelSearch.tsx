import React, { useState } from 'react';
import Modal from 'react-modal';
import './ChannelSearch.css';
import { ChannelLookup } from 'components/chat/ChannelLookUp';
import { CreateChannelForm } from 'components/chat/createChannelForm';
import { MyChannel } from 'navigation/interfaces/Channel.interface';

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
	const [chatRooms, setChatRooms] = useState<MyChannel[]>([]);

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
			<ChannelLookup chatRooms={chatRooms}></ChannelLookup>
			<div className='create-channel-form'>
				<CreateChannelForm></CreateChannelForm>
			</div>
      </Modal>
    </div>
  );
};

export default ChannelSearch;
