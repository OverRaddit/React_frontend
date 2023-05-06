import React from 'react';
import defaultProfilePicture from './defaultProfilePicture.jpg';
import './RecentMatchCard.css';

export interface RecentMatch {
  id: number;
  status: number;
  mapnumber: number;
  winscore: number;
  losescore: number;
  loser: {
    id: number;
    intraid: string;
    avatar: string;
    nickname: string;
    rating: number;
    wincount: number;
    losecount: number;
    email: string;
    isotp: boolean;
  };
  winner: {
    id: number;
    intraid: string;
    avatar: string;
    nickname: string;
    rating: number;
    wincount: number;
    losecount: number;
    email: string;
    isotp: boolean;
  };
}

// 위에서 정의한 인터페이스를 사용하여 prop을 지정합니다.
const RecentMatchCard: React.FC<RecentMatch> = (props) => {
  const {
    winscore,
    losescore,
    winner,
    loser,
  } = props;

  const winnerProfilePicture = winner.avatar || defaultProfilePicture;
  const loserProfilePicture = loser.avatar || defaultProfilePicture;

  return (
    <div className="recent-match-card">
      <div className="winner">
        <img
          className="winner-profile-picture"
          src={winnerProfilePicture}
          alt="Winner's profile"
        />
        <div className="winner-nickname">{winner.nickname}</div>
      </div>
      <div className="score">
        {winscore} : {losescore}
      </div>
      <div className="loser">
        <img
          className="loser-profile-picture"
          src={loserProfilePicture}
          alt="Loser's profile"
        />
        <div className="loser-nickname">{loser.nickname}</div>
      </div>
    </div>
  );
};

export default RecentMatchCard;
