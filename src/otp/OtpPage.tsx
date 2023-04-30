import React, { useState, useEffect } from 'react';
import './OtpPage.css';
import axios from 'axios';
import { useCookies } from 'react-cookie';
import { useNavigate } from 'react-router-dom';

interface Props {
  onHideNavigation: () => void;
}

const OtpPage: React.FC<Props> = ({ onHideNavigation }) => {
  useEffect(() => {
    onHideNavigation();
  }, [onHideNavigation]);

  const [cookies] = useCookies(['email']);
  const [email] = useState(cookies.email);
  const [otp, setOtp] = useState('');
  const [isOtpIncorrect, setIsOtpIncorrect] = useState(false);
  const navigate = useNavigate();

  const handleOtpChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setOtp(e.target.value);
  };

  const handleVerifyButtonClick = async () => {
    try {
      const response = await axios.post('http://localhost:3000/otp', { otp_key: otp }, { withCredentials: true});
      if (response.status >= 200 && response.status < 300) {
        navigate('/loginok');
      }      
    } catch (error: any) {
      if (error.response && typeof error.response.status === 'number') {
        if (error.response.status === 500) {
          setIsOtpIncorrect(true);
        }
      } else {
        console.error('An unexpected error occurred:', error);
      }
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
      <p className={`warning-message ${isOtpIncorrect ? 'active' : ''}`}>
        인증번호가 틀렸습니다.
      </p>
      <button className="verify-button" onClick={handleVerifyButtonClick}>
        Verify
      </button>
    </div>
  );
};

export default OtpPage;
