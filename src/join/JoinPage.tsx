import React, { useState, useEffect } from 'react';
import './JoinPage.css';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useCookies } from 'react-cookie';
import defaultProfilePicture from '../profile/defaultProfilePicture.jpg';
import ProfilePictureModal from 'profile/ProfilePictureModal';

interface Props {
  onHideNavigation: () => void;
}

const JoinPage: React.FC<Props> = ({ onHideNavigation }) => {
  
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

  useEffect(() => {
    onHideNavigation();
    const fetchUserData = async () => {
      try {
        const response = await axios.get(
          `http://localhost:3000/user${nickname ? `/${nickname}` : ''}`, { withCredentials: true }
        );
        setUserData(response.data);
      } catch (error) {
        console.error('Failed to fetch user data:', error);
      }
    };
    fetchUserData();
  }, [onHideNavigation]);

  const [cookies, setCookie, removeCookie] = useCookies(['nickname']);
  const [nickname, setNickname] = useState(cookies.nickname);
  const [isDuplicate, setIsDuplicate] = useState(false);
  const [isAnonymous, setIsAnonymous] = useState(false);
  const [isEmpty, setIsEmpty] = useState(false);
  const navigate = useNavigate();

  const isAnonymousNickname = (nickname: string) => {
    return nickname.startsWith('anon_');
  };

  const handleNicknameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newNickname = e.target.value;
    setNickname(newNickname);
    setIsEmpty(newNickname === '');

    if (isAnonymousNickname(newNickname)) {
      setIsAnonymous(true);
    } else {
      setIsAnonymous(false);
    }
  };

  const handleJoinButtonClick = async () => {
    if (!isAnonymous && !isEmpty) {
      try {
        const response = await axios.post('http://localhost:3000/user/join', { nickname: nickname }, { withCredentials: true });
        if (response.status >= 200 && response.status < 300) {
          navigate('/');
        }        
      } catch (error : any) {
        if (error.response && typeof error.response.status === 'number') {
          if (error.response.status === 500) {
            setIsDuplicate(true);
          }
        } else {
          console.error('An unexpected error occurred:', error);
        }
    }
  }
};
const displayProfilePicture = userData.avatar || defaultProfilePicture;
const [isProfilePictureModalOpen, setIsProfilePictureModalOpen] = useState(false);

const openProfilePictureModal = () => {
  setIsProfilePictureModalOpen(true);
};

const closeProfilePictureModal = () => {
  setIsProfilePictureModalOpen(false);
};
  return (
    <div className="join-page">
      <div className="profile-picture-wrapper">
        <img
          className="profile-picture"
          src={displayProfilePicture}
          alt="프로필 사진"
          onClick={openProfilePictureModal}
          />
      </div>
      <h3>닉네임을 입력해주세요.</h3>
      <input
        type="text"
        placeholder="Please enter a nickname"
        value={nickname}
        onChange={handleNicknameChange}
        className={`join-input ${isDuplicate || isAnonymous || isEmpty ? 'error' : ''}`}
      />
      {isDuplicate && (
        <p className="warning-message visible">중복된 닉네임 입니다.</p>
      )}
      {isAnonymous && (
        <p className="warning-message visible">익명 닉네임은 사용할 수 없습니다.</p>
      )}
      {isEmpty && (
        <p className="warning-message visible">빈 닉네임은 허용되지 않습니다.</p>
      )}
      {!isAnonymous && !isDuplicate && !isEmpty && (
        <p className="warning-message"></p>
      )}
      <button className="join-button" onClick={handleJoinButtonClick}>
        Join
      </button>

      <ProfilePictureModal
          isOpen={isProfilePictureModalOpen}
          onRequestClose={closeProfilePictureModal}
          onUpload={(url: string) => {
            setUserData({ ...userData, avatar: url });
            closeProfilePictureModal();
          }}
        />
    </div>
  );
};

export default JoinPage;
