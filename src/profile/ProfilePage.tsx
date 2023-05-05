import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Modal from 'react-modal';
import './ProfilePage.css';
import defaultProfilePicture from './defaultProfilePicture.jpg';
import NicknameChangeModal from './NicknameChangeModal';
import FriendButton from './FriendButton';
import ProfilePictureModal from './ProfilePictureModal';
import { useParams } from 'react-router-dom';
import { useMyContext } from '../MyContext'; // Import the context
import { MyFriend } from 'navigation/interfaces/Friend.interface';

const ProfilePage: React.FC = () => {
  const { myData, setMyData, friends, setFriends } = useMyContext(); // Access the context
  const { userId } = useParams<{ userId?: string }>(); // Get the userId from the route

  const isMyProfile = !userId || (myData && myData.intraid === userId) || false;

  const [userData, setUserData] = useState({
    id: 0,
    intraid: '',
    avatar: '',
    nickname: '',
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
    // TODO: 없는 사람일때에(404 받으면?) 예외처리 필요 

    fetchUserData();
  }, [userId]);

  const isFriend = friends.some((friend) => friend.id === userData.id);
  const displayProfilePicture = userData.avatar || defaultProfilePicture;

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

  const onAddFriend = async () => {
    try {
      await axios.post(
        'http://localhost:3000/friendlist',
        { friend: userData.intraid },
        { withCredentials: true }
      );
  
      const newFriend: MyFriend = {
        ...userData,
        socketid: '',
        status: 'offline',
      };
  
      setFriends([...friends, newFriend]);
    } catch (error) {
      console.error('Failed to add friend:', error);
    }
  };

  const onRemoveFriend = async () => {
    try {
      await axios.delete(
        `http://localhost:3000/friendlist/${userData.intraid}`,
        { withCredentials: true }
      );
  
      // 친구 목록에서 삭제된 친구를 제거
      setFriends(friends.filter((friend) => friend.intraid !== userData.intraid));
    } catch (error) {
      console.error('Failed to remove friend:', error);
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
          onNicknameChange={(newNickname: string) => {
            if (isMyProfile) {
              if (myData) {
                setMyData({
                  avatar: myData.avatar,
                  intraid: myData.intraid,
                  id: myData.id,
                  nickname: newNickname,
                });
              }
            }
            setUserData({ ...userData, nickname: newNickname });
          }}
        />

      
        <ProfilePictureModal
          isOpen={isProfilePictureModalOpen}
          onRequestClose={closeProfilePictureModal}
          onUpload={(url: string) => {
            setUserData({ ...userData, avatar: url });
            if (myData) {
              setMyData({
                avatar: url,
                intraid: myData.intraid,
                id: myData.id,
                nickname: myData.nickname,
              });
            }
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
