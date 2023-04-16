import React, { useEffect } from 'react';
import './LoginPage.css';

interface Props {
  onHideNavigation: () => void;
}

const LoginPage: React.FC<Props> = ({ onHideNavigation }) => {
  useEffect(() => {
    onHideNavigation(); // 페이지 로드시 네비게이션 숨기기

  }, [onHideNavigation]);

  const handleLoginButtonClick = () => {
    // 로그인 처리
  };

  return (
    <div className="App-content login-page">
        <div className="login-page">
        <button className="login-button" onClick={handleLoginButtonClick}>Login</button>
        </div>
    </div>
  );
};

export default LoginPage;
