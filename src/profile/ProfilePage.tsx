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
import RecentMatchCard, { RecentMatch } from './RecentMatchCard';
import { MyFriend } from 'navigation/interfaces/interfaces';

interface Props {
  onShowNavigation: () => void;
}

const ProfilePage: React.FC<Props> = ({ onShowNavigation }) => {
  const { myData, setMyData, friends, setFriends, userBlackList, setUserBlackList } = useMyContext(); // Access the context
  let { userId } = useParams<{ userId?: string }>();
  const isMyProfile = !userId || (myData && myData.intraid === userId) || false;
  //const [blacklist, setBlacklist] = useState<string[]>([]);

  // userId가 없을 경우 myData의 intraid를 사용
  if (!userId && myData) {
    userId = myData.intraid;
  }

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
  const [recentMatches, setRecentMatches] = useState<RecentMatch[]>([]);

  useEffect(() => {
    onShowNavigation();
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
    const fetchRecentMatches = async () => {
      try {
        const response = await axios.get(`http://localhost:3000/matchhistory/${userId}`);
        setRecentMatches(response.data.slice(0, 5));
        console.log(recentMatches[0]);
      } catch (error) {
        console.error('Failed to fetch recent matches:', error);
      }
    };

    // TODO: 없는 사람일때에(404 받으면?) 예외처리 필요

    fetchUserData();
    fetchRecentMatches();
  }, [userId, onShowNavigation]);

  const isFriend = friends.some((friend) => friend.id === userData.id);
  const isBlocked = userBlackList.some(user => user.intraid === userData.intraid);
  const displayProfilePicture = userData.avatar || defaultProfilePicture;

  const onBlockUser = async () => {
    try {
      await axios.post(
        'http://localhost:3000/userblacklist',
        { blacklist: userData.intraid },
        { withCredentials: true }
      );

      const newFriend: MyFriend = {
        ...userData,
        socketid: '',
        status: 'offline',
      };

      setUserBlackList([...userBlackList, newFriend]);
    } catch (error) {
      console.error('Failed to block user:', error);
    }
  };

  const onUnblockUser = async () => {
    try {
      await axios.delete(
        `http://localhost:3000/userblacklist/${userData.intraid}`,
        { withCredentials: true }
      );

      setUserBlackList(userBlackList.filter(user => user.intraid !== userData.intraid));
    } catch (error) {
      console.error('Failed to unblock user:', error);
    }
  };
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

  const recentMatchCards = recentMatches.map((match) => (
    <RecentMatchCard key={match.id} {...match} />
  ));

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

          {!isMyProfile && (
            <button onClick={isBlocked ? onUnblockUser : onBlockUser}>
              {isBlocked ? '차단 해제' : '차단'}
            </button>
          )}

        </div>
          <div className="profile-recent-record">
            {recentMatchCards}
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
