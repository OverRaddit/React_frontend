import React, { createContext, useContext, useState } from 'react';
import { MyUser, MyChannel, MyFriend, MyData, MyInvite } from './navigation/interfaces/interfaces';
import io, { Socket } from 'socket.io-client';
import { useCookies } from 'react-cookie';

interface MySocket {
  chatSocket: Socket;
  gameSocket: Socket;
}

type MyContextProps = {
  users: MyUser[];
  channels: MyChannel[];
  friends: MyFriend[];
  myData: MyData | null;
  mySocket: MySocket | null;
  myInvite: MyInvite[];
  setUsers: (users: MyUser[]) => void;
  setChannels: (channels: MyChannel[]) => void;
  setFriends: (friends: MyFriend[]) => void;
  setMyData: (myData: MyData | null) => void;
  setMySocket: (mySocket: MySocket | null) => void;
  setMyInvite: (myInvite: MyInvite[]) => void;
  removeInvite: () => void;
  initSocket: () => void;
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
  myInvite: [],
  setUsers: () => {},
  setChannels: () => {},
  setFriends: () => {},
  setMyData: () => {},
  setMySocket: () => {},
  setMyInvite: () => {},
  removeInvite: () => {},
  initSocket: () => {},
};

export const MyContext = createContext<MyContextProps>(defaultMyContext);

export const MyContextProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [users, setUsers] = useState<MyUser[]>([]);
  const [channels, setChannels] = useState<MyChannel[]>([]);
  const [friends, setFriends] = useState<MyFriend[]>([]);
  const [myData, setMyData] = useState<MyData | null>(null);
  const [mySocket, setMySocket] = useState<MySocket | null>(null);
  const [myInvite, setMyInvite] = useState<MyInvite[]>([]);
  const [cookies, setCookie, removeCookie] = useCookies(['session_key']);

  const initSocket = () => {
    console.log('initSocket in MyContext (intraId, userId): ', myData!.intraid, ',', myData!.id.toString());
    const ChatSocket = io('http://localhost:4242/chat', {
      extraHeaders: {
        Authorization: `Bearer ${cookies.session_key}`,
        intraId: myData!.intraid,
        userId: myData!.id.toString(),
      },
    });
    const GameSocket = io("ws://localhost:8000");
    
    ChatSocket.on('initChannels', (response: EventResponse) => {
      console.log(response);
      if (!response.success) console.log(response.message);
      else {
        setChannels(response.data);
      }
    });

    setMySocket({ chatSocket:ChatSocket, gameSocket:GameSocket });
  };

  const removeInvite = () => {
    setMyInvite(myInvite.slice(1));
  };

  const value = {
    users,
    channels,
    friends,
    myData,
    mySocket,
    myInvite,
    setUsers,
    setChannels,
    setFriends,
    setMyData,
    setMySocket,
    setMyInvite,
    removeInvite,
    initSocket,
  };
  

  return <MyContext.Provider value={value}>{children}</MyContext.Provider>;
};

export function useMyContext() {
  const context = useContext(MyContext);
  return context;
}

