import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Modal from 'react-modal';
import './FriendModal.css';
import { useMyContext } from '../MyContext';
import { MyChannel, MyFriend } from './interfaces/interfaces';

interface FriendModalProps {
  friend: MyFriend;
  onClose: () => void; 
}

const FriendModal: React.FC<FriendModalProps> = ({ friend, onClose }) => {
  const [isModalOpen, setIsModalOpen] = useState(true);
  const { myData, mySocket } = useMyContext();

  const closeModal = () => {
    setIsModalOpen(false);
    onClose();
  };

  // TODO: invite 모달 만들면 이동
  const acceptInvite = (e: React.MouseEvent<HTMLButtonElement>) => {
    mySocket?.gameSocket.emit('Accept invitation', {myIntraId: myData!.intraid, oppIntraId: friend.intraid, enqueueFlag: false, gameType: 0}); // TODO
  };
  
  const sendInvite0 = (e: React.MouseEvent<HTMLButtonElement>) => {
    mySocket?.gameSocket.emit('Invite Game', {myIntraId: myData!.intraid, oppIntraId: friend.intraid, gameType: 0}); 
  };
  const sendInvite1 = (e: React.MouseEvent<HTMLButtonElement>) => {
    mySocket?.gameSocket.emit('Invite Game', {myIntraId: myData!.intraid, oppIntraId: friend.intraid, gameType: 1}); 
  };
  
  const isDMEnabled = friend.status === 'online' || friend.status === 'in-queue';
  const isInviteEnabled = friend.status === 'online';

  return (
      <Modal
        isOpen={isModalOpen}
        onRequestClose={closeModal}
        contentLabel="Friend Information Modal"
        className="friend-modal"
        overlayClassName="friend-modal-overlay"
      >
        <div className="friend-modal-content">
        <div className="profile-info">
          <img src={friend.avatar} alt={`${friend.nickname}'s avatar`} />
          <h2>{friend.nickname}</h2>
        </div>
          <Link to={`/profile/${friend.intraid}`}>
            <button onClick={closeModal}>프로필 보기</button>
          </Link>
          <button className={isDMEnabled ? '' : 'disabled'} disabled={!isDMEnabled}>
            DM 보내기
          </button>
          <button className={isInviteEnabled ? '' : 'disabled'} disabled={!isInviteEnabled}>
            게임 초대
          </button>
        </div>
      </Modal>
  );
};

export default FriendModal;
