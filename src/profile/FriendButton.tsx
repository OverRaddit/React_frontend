import React from 'react';

interface FriendButtonProps {
  isMyProfile: boolean;
  isFriend: boolean;
  onAddFriend?: () => void;
  onRemoveFriend?: () => void;
  onOpenOtpModal: () => void;
}

const FriendButton: React.FC<FriendButtonProps> = ({
  isMyProfile,
  isFriend,
  onAddFriend,
  onRemoveFriend,
  onOpenOtpModal,
}) => {
  if (isMyProfile) {
    return (
      <button className="otp-button" onClick={onOpenOtpModal}>
        OTP 설정
      </button>
    );
  } else if (isFriend) {
    return (
      <button className="friend-delete-button" onClick={onRemoveFriend}>
        친구 삭제
      </button>
    );
  } else {
    return (
      <button className="friend-add-button" onClick={onAddFriend}>
        친구 추가
      </button>
    );
  }
};

export default FriendButton;
