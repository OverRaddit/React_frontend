import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Modal from 'react-modal';
import './ProfilePage.css';
import defaultProfilePicture from './defaultProfilePicture.jpg';
import NicknameChangeModal from './NicknameChangeModal';
import FriendButton from './FriendButton';
import ProfilePictureModal from './ProfilePictureModal';

interface ProfilePageProps {
  userId?: string;
  isMyProfile?: boolean;
  friendList?: { id: number }[];
  onAddFriend?: () => void;
  onRemoveFriend?: () => void;
}

const ProfilePage: React.FC<ProfilePageProps> = ({
  userId,
  isMyProfile = false,
  friendList = [],
  onAddFriend,
  onRemoveFriend,
}) => {
  const [userData, setUserData] = useState({
    id: null,
    intraid: '',
    avatar: '',
    nickname: null,
    rating: null,
    wincount: null,
    losecount: null,
    email: '',
    isotp: false,
  });

  const [isOtpModalOpen, setIsOtpModalOpen] = useState(false);
  const [isNicknameModalOpen, setIsNicknameModalOpen] = useState(false);
  const [isProfilePictureModalOpen, setIsProfilePictureModalOpen] = useState(false);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await axios.get(
          `http://localhost:3000/user${userId ? `/${userId}` : ''}`, { withCredentials: true }
        );
        setUserData(response.data);
      } catch (error) {
        console.error('Failed to fetch user data:', error);
      }
    };

    fetchUserData();
  }, [userId]);

  const openOtpModal = () => {
    setIsOtpModalOpen(true);
  };

  const closeOtpModal = () => {
    setIsOtpModalOpen(false);
  };

  const openNicknameModal = () => {
    setIsNicknameModalOpen(true);
  };

  const closeNicknameModal = () => {
    setIsNicknameModalOpen(false);
  };

  const openProfilePictureModal = () => {
    setIsProfilePictureModalOpen(true);
  };

  const closeProfilePictureModal = () => {
    setIsProfilePictureModalOpen(false);
  };

  const toggleOtp = async () => {
    try {
      await axios.post('http://localhost:3000/user/otp', {
        otp: !userData.isotp,
      }, { withCredentials: true });
      setUserData({ ...userData, isotp: !userData.isotp });
      closeOtpModal();
    } catch (error) {
      console.error('Failed to update OTP setting:', error);
    }
  };

  if (!userData) {
    return <div>Loading...</div>;
  }

  const isFriend = friendList.some((friend) => friend.id === userData.id);

  const displayProfilePicture = userData.avatar || defaultProfilePicture;

  const uploadFile = async (file: File) => {
    try {
      const formData = new FormData();
      formData.append('file', file);
      const response = await axios.post('http://localhost:3000/uploads', formData, {
        withCredentials: true,
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return response.data.url;
    } catch (error) {
      console.error('Failed to upload file:', error);
    }
  };

  return (
    <div className="profile-page">
      <div className="profile-info">
        <div className="profile-picture-wrapper">
          <img
            className="profile-picture"
            src={displayProfilePicture}
            alt="프로필 사진"
            onClick={isMyProfile ? openProfilePictureModal : undefined}
            />
          </div>
          <div
            className="profile-nickname"
            onClick={isMyProfile ? openNicknameModal : undefined}
          >
            {userData.nickname}
          </div>
          <div className="friend-button-wrapper">
            <FriendButton
              isMyProfile={isMyProfile}
              isFriend={isFriend}
              onAddFriend={onAddFriend}
              onRemoveFriend={onRemoveFriend}
              onOpenOtpModal={openOtpModal}
            />
          </div>
        </div>
        <div className="profile-recent-record">
          {/* 이 부분에 최근 전적을 출력하는 코드를 작성하세요. */}
        </div>
      
        <NicknameChangeModal
          isOpen={isNicknameModalOpen}
          onRequestClose={closeNicknameModal}
          userId={userId}
        />
      
        <ProfilePictureModal
          isOpen={isProfilePictureModalOpen}
          onRequestClose={closeProfilePictureModal}
          onUpload={(url: string) => {
            setUserData({ ...userData, avatar: url });
            closeProfilePictureModal();
          }}
        />
      
        <Modal
          isOpen={isOtpModalOpen}
          onRequestClose={closeOtpModal}
          contentLabel="OTP 설정 모달"
        >
          <div>OTP 설정</div>
          <button onClick={toggleOtp}>
            {userData.isotp ? '비활성화' : '활성화'}
          </button>
          <button onClick={closeOtpModal}>취소</button>
        </Modal>
      </div>
      );
    };
    
    export default ProfilePage;
