import './App.css';
import { useState, useEffect } from 'react';
import Navigation from './navigation/Navigation.tsx';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import XPage from './pages/XPage';
import ZPage from './pages/ZPage';
import DefaultPage from './pages/DefaultPage';
import ProfilePage from './profile/ProfilePage.tsx';
import LoginPage from './login/LoginPage.tsx';
import JoinPage from './join/JoinPage';
import OtpPage from './otp/OtpPage';
import Game from './pages/YPage';
import { MyContextProvider } from './MyContext';
import LoginOK from 'login/LoginOK';
import MainPage from 'main/MainPage';

function App() {
  const [isNavigationVisible, setIsNavigationVisible] = useState(true);

  const showNavigation = () => {
    setIsNavigationVisible(true);
  };

  const hideNavigation = () => {
    setIsNavigationVisible(false);
  };

  return (
    <Router>
      <MyContextProvider>
        <div className="App">
          <div className={`App-content ${!isNavigationVisible ? 'no-navigation' : ''}`}>
            {isNavigationVisible && <Navigation />}

            <Routes>
              <Route path="/" element={<MainPage onShowNavigation={showNavigation} />} />
              <Route path="/a" element={<XPage/>} />
              {/* <Route path="/game" element={<Game socket={socket} room={room} nickName={nickName} isExtension={isExQueue}/>} /> */}
              <Route path="/game" element={<Game />} />
              <Route path="/c" element={<ZPage />} />
              <Route path="/profile/:userId?" element={<ProfilePage />} />
              <Route path="/login" element={<LoginPage onHideNavigation={hideNavigation}/>} />
              <Route path="/loginok" element={<LoginOK onShowNavigation={showNavigation} />} />
              <Route path="/join" element={<JoinPage onHideNavigation={hideNavigation} />} />
              <Route path="/otp" element={<OtpPage onHideNavigation={hideNavigation} />} />
            </Routes>
          </div>
        </div>
      </MyContextProvider>
    </Router>
  );
}

export default App;
