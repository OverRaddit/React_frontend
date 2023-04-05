import React from 'react';
import './ProfilePage.css';
import defaultProfilePicture from './defaultProfilePicture.jpg';

interface ProfilePageProps {
  // 유저 정보를 받을 props
  profilePicture?: string;
  nickname?: string;
  friend?: boolean;
  // 최근 전적 정보를 받을 props
  recentRecords?: {
    opponentPicture: string;
    opponentNickname: string;
    isWin: boolean;
    myScore: number;
    opponentScore: number;
  }[];
  // 전체 전적 정보를 받을 props
  winCount?: number;
  loseCount?: number;
  // 친구 추가/삭제를 위한 props
  onAddFriend?: () => void;
  onRemoveFriend?: () => void;
}

const ProfilePage: React.FC<ProfilePageProps> = ({
  profilePicture = defaultProfilePicture,
  nickname = 'Unknown',
  friend = false,
  recentRecords = [
    {
      opponentPicture: 'https://example.com/opponent1.jpg',
      opponentNickname: 'Player1',
      isWin: true,
      myScore: 5,
      opponentScore: 2,
    },
    {
      opponentPicture: 'https://example.com/opponent2.jpg',
      opponentNickname: 'Player2',
      isWin: false,
      myScore: 1,
      opponentScore: 5,
    },
    {
      opponentPicture: 'https://example.com/opponent3.jpg',
      opponentNickname: 'Player3',
      isWin: true,
      myScore: 5,
      opponentScore: 2,
    },
  ],
  winCount = 3,
  loseCount = 2,
  onAddFriend,
  onRemoveFriend,
}) => {
  const friendButton = friend ? (
    <button className="friend-delete-button" onClick={onRemoveFriend}>
      친구 삭제
    </button>
  ) : (
    <button className="friend-add-button" onClick={onAddFriend}>
      친구 추가
    </button>
  );

  const winLoseRatio = `${winCount}승 ${loseCount}패`;

  return (
    <div className="profile-page">
      <div className="profile-info">
        <div className="profile-picture-wrapper">
          <img className="profile-picture" src={profilePicture} alt="프로필 사진" />
        </div>
        <div className="profile-nickname">{nickname}</div>
        <div className="friend-button-wrapper">{friendButton}</div>
      </div>
      <div className="profile-recent-record">
        {recentRecords.map((record, index) => (
          <div key={index} className="recent-record-item">
            <div className="recent-opponent-info">
              <div className="recent-opponent-picture-wrapper">
                <img className="recent-opponent-picture" src={record.opponentPicture} alt="최근 상대방 사진" />
              </div>
              <div className="recent-opponent-nickname">{record.opponentNickname}</div>
            </div>
            <div className={`recent-result ${record.isWin ? 'win' : 'lose'}`}>{record.isWin ? '승리' : '패배'}</div>
            <div className="recent-score">{`${record.myScore} : ${record.opponentScore}`}</div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProfilePage;

