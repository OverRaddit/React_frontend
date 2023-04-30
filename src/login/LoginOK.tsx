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
        const response = await axios.get(
          `http://localhost:3000/user`, { withCredentials: true }
        );
        setMyData(response.data);
        const response2 = await axios.get(
          `http://localhost:3000/friendlist`, { withCredentials: true }
        );
        setFriends(response2.data);

        onShowNavigation();
      } catch (error) {
        console.error('Failed to fetch user data:', error);
      }
    };
    fetchUserData();
  }, [setMyData, onShowNavigation]);

  return (
    <div>
      <h1>intraId : {myData?.intraid}!</h1>
      <h1>socketId : {myData?.socketid}!</h1>
      <h1>id : {myData?.id}!</h1>
      <h1>profile : {myData?.avatar}!</h1>
      <h1>nickname : {myData?.nickname}!</h1>
      <h1>friend : {friends[0].id}!</h1>
      <h1>friend : {friends[0].intraid}!</h1>
      <h1>friend : {friends[0].nickname}!</h1>
      <h1>friend : {friends[0].sockerid}!</h1>
      <h1>friend : {friends[0].status}!</h1>
    </div>
  );
};

export default LoginOK;
