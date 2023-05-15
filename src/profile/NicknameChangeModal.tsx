import React, { useState, useEffect } from 'react';
import Modal from 'react-modal';
import axios from 'axios';

interface NicknameChangeModalProps {
  isOpen: boolean;
  onRequestClose: () => void;
  userId?: string;
  onNicknameChange: (newNickname: string) => void;
}

const NicknameChangeModal: React.FC<NicknameChangeModalProps> = ({
  isOpen,
  onRequestClose,
  userId,
  onNicknameChange,
}) => {
  const [nickname, setNickname] = useState('');
  const [isDuplicate, setIsDuplicate] = useState(false);
  const [isAnonymous, setIsAnonymous] = useState(false);
  const [isEmpty, setIsEmpty] = useState(true);

  useEffect(() => {
    if (isOpen) {
      setNickname('');
      setIsDuplicate(false);
      setIsAnonymous(false);
      setIsEmpty(false);
    }
  }, [isOpen]);

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

  const handleSubmit = async () => {
    if (!isAnonymous && nickname !== '') {
      try {
        const response = await axios.post('http://localhost:3000/user/join', { nickname: nickname }, { withCredentials: true });
        if (response.status >= 200 && response.status < 300) {
          onRequestClose();
          // Call the onNicknameChange callback
          onNicknameChange(nickname);
        }
      } catch (error: any) {
        if (error.response && typeof error.response.status === 'number') {
          if (error.response.status === 500) {
            setIsDuplicate(true);
          }
        } else {
          console.error('An unexpected error occurred:', error);
        }
      }
    }
    if (nickname === ''){
      setIsEmpty(true);
    }
  };
  
  return (
    <Modal isOpen={isOpen} onRequestClose={onRequestClose}>
      <h3>닉네임을 변경해주세요.</h3>
      <input
        type="text"
        placeholder="Please enter a new nickname"
        value={nickname}
        onChange={handleNicknameChange}
        className={`nickname-input ${isDuplicate || isAnonymous || isEmpty ? 'error' : ''}`}
      />
      {isDuplicate && (
        <p className="warning-message visible">중복된 닉네임입니다.</p>
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
      <button className="submit-button" onClick={handleSubmit}>
        변경
      </button>
      <button className="close-button" onClick={onRequestClose}>
        닫기
      </button>
    </Modal>
  );
};

export default NicknameChangeModal;
