import { useMyContext } from '../MyContext';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react';

interface Props {
  onShowNavigation: () => void;
}

const LoginOK: React.FC<Props> = ({ onShowNavigation }) => {
  const navigate = useNavigate();
  const { myData, setMyData } = useMyContext();

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await axios.get(
          `http://localhost:3000/user`, { withCredentials: true }
        );
        setMyData(response.data);
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
    </div>
  );
};

export default LoginOK;
