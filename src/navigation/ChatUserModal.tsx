import React, { FC, useContext } from 'react';
import Modal from 'react-modal';
import './ChatUserModal.css';
import { MyUser } from './interfaces/interfaces';
import { Link } from 'react-router-dom';
import { MyContext } from '../MyContext';

type ChatUserModalProps = {
  user: MyUser;
  myChannelData: MyUser;
  onClose: () => void;
  isOpen: boolean;
  channelId: number;
};

const ChatUserModal: FC<ChatUserModalProps> = ({
  user,
  myChannelData,
  onClose,
  isOpen,
  channelId,
}) => {
  const isMe = myChannelData.intraId === user.intraId;
  const { mySocket } = useContext(MyContext);

  const handleDelegate = () => {
    mySocket?.socket.emit('delegateChannel', { userId: user.id, roomName: channelId }, (response:any) => {
      console.log(response);
    });
    onClose();
  };

const handlePermission = () => {
  mySocket?.socket.emit('permissionChannel', { userId: user.id, roomName: channelId }, (response:any) => {
    console.log(response);
  });
  onClose();
};

const handleRevoke = () => {
  mySocket?.socket.emit('revokeChannel', { userId: user.id, roomName: channelId }, (response:any) => {
    console.log(response);
  });
  onClose();
};

const handleKick = () => {
  mySocket?.socket.emit('kick', { userId: user.id, roomName: channelId }, (response:any) => {
    console.log(response);
  });
  onClose();
};

const handleBan = () => {
  mySocket?.socket.emit('ban', { userId: user.id, roomName: channelId }, (response:any) => {
    console.log(response);
  });
  onClose();
};

const handleMute = () => {
  mySocket?.socket.emit('mute', { userId: user.id, roomName: channelId }, (response:any) => {
    console.log(response);
  });
  onClose();
};


  return (
    <Modal
      className="ChatUserModal"
      overlayClassName="ChatUserModal-overlay"
      isOpen={isOpen}
      onRequestClose={onClose}
      contentLabel="Chat User Modal"
    >
      <h2>{user.nickname}</h2>
      <Link to={`/profile/${user.intraId}`}>
        <button onClick={onClose}>프로필 보기</button>
      </Link>
      {!isMe && (
        <>
          {myChannelData.isOwner && (
            <>
              {user.isAdmin ? (
                <button onClick={handleRevoke}>관리자 박탈</button>
              ) : (
                <button onClick={handlePermission}>관리자 임명</button>
              )}
              <button onClick={handleDelegate}>방장 임명</button>
            </>
          )}
          {myChannelData.isAdmin && (
            <>
              <button onClick={handleKick}>킥</button>
              <button onClick={handleBan}>밴</button>
              <button onClick={handleMute}>뮤트</button>
            </>
          )}
        </>
      )}
    </Modal>
  );
};

export default ChatUserModal;
