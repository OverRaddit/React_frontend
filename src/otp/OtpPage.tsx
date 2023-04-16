import React, { useState, useEffect } from 'react';
import './OtpPage.css';

interface Props {
  onHideNavigation: () => void;
}

const OtpPage: React.FC<Props> = ({ onHideNavigation }) => {
  useEffect(() => {
    onHideNavigation();
  }, [onHideNavigation]);

  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [isOtpIncorrect, setIsOtpIncorrect] = useState(false);

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
  };

  const handleOtpChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setOtp(e.target.value);
  };

  const handleVerifyButtonClick = () => {
    // 인증번호 확인 로직을 여기에 추가하세요.
    if (otp === '1234') {
      // 인증 성공 처리
    } else {
      setIsOtpIncorrect(true);
    }
  };

  return (
    <div className="otp-page">
      <div className="message-container">
        <p className="email-message">이메일: {email}</p>
        <p className="success-message">인증번호가 성공적으로 발송되었습니다.</p>
      </div>
      <input
        type="text"
        placeholder="Enter OTP"
        value={otp}
        onChange={handleOtpChange}
        className={`otp-input ${isOtpIncorrect ? 'error' : ''}`}
      />
      {isOtpIncorrect && (
        <p className="warning-message active">인증번호가 틀렸습니다.</p>
      )}
      <button className="verify-button" onClick={handleVerifyButtonClick}>
        Verify
      </button>
    </div>
  );
};

export default OtpPage;

