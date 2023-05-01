import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Modal from 'react-modal';
import './FriendModal.css';

type UserStatus = 'online' | 'in-game' | 'in-queue' | 'offline';

export interface MyFriend {
  id: number;
  nickname: string;
  intraid: string;
  socketid: string;
  avatar: string;
  status: UserStatus;
}

interface FriendModalProps {
  friend: MyFriend;
  onClose: () => void; 
}

const FriendModal: React.FC<FriendModalProps> = ({ friend }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const openModal = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const isDMEnabled = friend.status === 'online' || friend.status === 'in-queue';
  const isInviteEnabled = friend.status === 'online';

  return (
    <>
      <button onClick={openModal}>{friend.nickname}</button>
      <Modal
        isOpen={isModalOpen}
        onRequestClose={closeModal}
        contentLabel="Friend Information Modal"
        className="friend-modal"
        overlayClassName="friend-modal-overlay"
      >
        <div className="friend-modal-content">
          <img src={friend.avatar} alt={`${friend.nickname}'s avatar`} />
          <h2>{friend.nickname}</h2>
          <Link to={`/profile/${friend.intraid}`}>
            <button>프로필 보기</button>
          </Link>
          <button disabled={!isDMEnabled}>DM 보내기</button>
          <button disabled={!isInviteEnabled}>게임 초대</button>
        </div>
      </Modal>
    </>
  );
};

export default FriendModal;
