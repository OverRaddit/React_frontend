import React, { createContext, useContext, useState } from 'react';
import { MyUser, MyChannel, MyFriend, MyData } from './navigation/interfaces/interfaces';
import io, { Socket } from 'socket.io-client';
import { useCookies } from 'react-cookie';

interface MySocket {
  socket: Socket;
}

type MyContextProps = {
  users: MyUser[];
  channels: MyChannel[];
  friends: MyFriend[];
  myData: MyData | null;
  mySocket: MySocket | null;
  setUsers: (users: MyUser[]) => void;
  setChannels: (channels: MyChannel[]) => void;
  setFriends: (friends: MyFriend[]) => void;
  setMyData: (myData: MyData | null) => void;
  setMySocket: (mySocket: MySocket | null) => void;
  initSocket: (url: string) => void;
};

interface EventResponse {
  success: boolean;
  message: string;
  data: any[];
}


const defaultMyContext = {
  users: [],
  channels: [],
  friends: [],
  myData: null,
  mySocket: null,
  setUsers: () => {},
  setChannels: () => {},
  setFriends: () => {},
  setMyData: () => {},
  setMySocket: () => {},
  initSocket: (url: string) => {},
};

export const MyContext = createContext<MyContextProps>(defaultMyContext);

export const MyContextProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [users, setUsers] = useState<MyUser[]>([]);
  const [channels, setChannels] = useState<MyChannel[]>([]);
  const [friends, setFriends] = useState<MyFriend[]>([]);
  const [myData, setMyData] = useState<MyData | null>(null);
  const [mySocket, setMySocket] = useState<MySocket | null>(null);
  const [cookies, setCookie, removeCookie] = useCookies(['session_key']);

  const initSocket = (url: string) => {
    console.log('initSocket in MyContext (intraId, userId): ', myData!.intraid, ',', myData!.id.toString());
    const socket = io(url, {
      extraHeaders: {
        Authorization: `Bearer ${cookies.session_key}`,
        intraId: myData!.intraid,
        userId: myData!.id.toString(),
      },
    });
    setMySocket({ socket });

    socket.on('initChannels', (response: EventResponse) => {
      console.log(response);
      if (!response.success) console.log(response.message);
      else {
        setChannels(response.data);
      }
    });
  };

  const value = {
    users,
    channels,
    friends,
    myData,
    mySocket,
    setUsers,
    setChannels,
    setFriends,
    setMyData,
    setMySocket,
    initSocket,
  };

  return <MyContext.Provider value={value}>{children}</MyContext.Provider>;
};

export function useMyContext() {
  const context = useContext(MyContext);
  return context;
}
