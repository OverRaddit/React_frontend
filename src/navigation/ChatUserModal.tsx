import React, { FC } from 'react';
import Modal from 'react-modal';
import './ChatUserModal.css';
import { MyUser } from './interfaces/interfaces';
import { Link } from 'react-router-dom';

type ChatUserModalProps = {
  user: MyUser;
  myChannelData: MyUser;
  onClose: () => void;
  isOpen: boolean;
};

const ChatUserModal: FC<ChatUserModalProps> = ({
  user,
  myChannelData,
  onClose,
  isOpen,
}) => {
  const isMe = myChannelData.intraId === user.intraId;

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
                <button>관리자 박탈</button>
              ) : (
                <button>관리자 임명</button>
              )}
            </>
          )}
          {myChannelData.isAdmin && (
            <>
              <button>킥</button>
              <button>밴</button>
              <button>뮤트</button>
            </>
          )}
        </>
      )}
    </Modal>
  );
};

export default ChatUserModal;
