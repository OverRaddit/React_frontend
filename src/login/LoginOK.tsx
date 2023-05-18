import React from 'react';
import { useMyContext } from '../MyContext';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react';

interface Props {
  onShowNavigation: () => void;
}

const LoginOK: React.FC<Props> = ({ onShowNavigation }) => {
  const navigate = useNavigate();
  const { myData, setMyData, friends, setFriends } = useMyContext();

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        if (!myData) {
          const response = await axios.get(
            `${process.env.REACT_APP_IP_ADDRESS}/user`, { withCredentials: true }
          );
          setMyData(response.data);
        }
        if (!friends) {
          const response2 = await axios.get(
            `${process.env.REACT_APP_IP_ADDRESS}/friendlist`, { withCredentials: true }
          );
          setFriends(response2.data);
        }
        onShowNavigation();
      } catch (error) {
        console.error('Failed to fetch user data:', error);
      }
    };
    fetchUserData();
  }, [setMyData, setFriends, onShowNavigation]);

  return (
    <div>
      <h1>intraId: {myData?.intraid}!</h1>
      <h1>id: {myData?.id}!</h1>
      <h1>profile: {myData?.avatar}!</h1>
      <h1>nickname: {myData?.nickname}!</h1>
      <h1>friend: {friends[0]?.id}!</h1>
      <h1>friend: {friends[0]?.intraid}!</h1>
      <h1>friend: {friends[0]?.nickname}!</h1>
      <h1>friend: {friends[0]?.socketid}!</h1>
      <h1>friend: {friends[0]?.status}!</h1>
      <h1>friend: {friends[0]?.avatar}!</h1>
    </div>
  );
};

export default LoginOK;
