import React, { useState, useEffect } from 'react';
import './JoinPage.css';

interface Props {
  onHideNavigation: () => void;
}

const JoinPage: React.FC<Props> = ({ onHideNavigation }) => {
  useEffect(() => {
    onHideNavigation(); // 페이지 로드시 네비게이션 숨기기
  }, [onHideNavigation]);

  const [nickname, setNickname] = useState('테스트');
  const [isDuplicate, setIsDuplicate] = useState(false);
  const [isAnonymous, setIsAnonymous] = useState(false);

  const isAnonymousNickname = (nickname: string) => {
    return nickname.startsWith('anon_');
  };

  const handleNicknameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newNickname = e.target.value;
    setNickname(newNickname);

    if (isAnonymousNickname(newNickname)) {
      setIsAnonymous(true);
    } else {
      setIsAnonymous(false);
    }

    // 이미 존재하는 닉네임인지 확인하는 로직은 기존대로 유지
  };

  const handleJoinButtonClick = () => {
    // 닉네임 중복 검사 및 익명 닉네임 검사 로직을 여기에 추가하세요.
    // 예를 들어:
    // setIsDuplicate(checkDuplicate(nickname));
    // setIsAnonymous(checkAnonymous(nickname));

    // 닉네임 검사가 성공적으로 완료되면 회원 가입 처리를 진행하세요.
    if (!isDuplicate && !isAnonymous) {
      // 회원 가입 처리
    }
  };

  return (
    <div className="join-page">
    <input
      type="text"
      placeholder="Enter your nickname"
      value={nickname}
      onChange={handleNicknameChange}
      className={`join-input ${isDuplicate || isAnonymous ? 'error' : ''}`}
    />
    {isDuplicate && (
      <p className="warning-message visible">중복된 닉네임 입니다.</p>
    )}
    {isAnonymous && (
      <p className="warning-message visible">익명 닉네임은 사용할 수 없습니다.</p>
    )}
    {!isAnonymous && !isDuplicate && (
        <p className="warning-message"></p>
      )}
    <button className="join-button" onClick={handleJoinButtonClick}>
      Join
    </button>
  </div>
  );
};

export default JoinPage;
