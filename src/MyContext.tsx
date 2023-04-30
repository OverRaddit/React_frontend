import React, { createContext, useContext, useState } from 'react';
import { MyUser, MyChannel, MyFriend, MyData } from './navigation/interfaces/interfaces';

type MyContextProps = {
  users: MyUser[];
  channels: MyChannel[];
  friends: MyFriend[];
  myData: MyData | null;
  setUsers: (users: MyUser[]) => void;
  setChannels: (channels: MyChannel[]) => void;
  setFriends: (friends: MyFriend[]) => void;
  setMyData: (myData: MyData | null) => void;
};

const defaultMyContext = {
  users: [],
  channels: [],
  friends: [],
  myData: null,
  setUsers: () => {},
  setChannels: () => {},
  setFriends: () => {},
  setMyData: () => {},
};

export const MyContext = createContext<MyContextProps>(defaultMyContext);

export const MyContextProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [users, setUsers] = useState<MyUser[]>([]);
  const [channels, setChannels] = useState<MyChannel[]>([]);
  const [friends, setFriends] = useState<MyFriend[]>([]);
  const [myData, setMyData] = useState<MyData | null>(null);

  const value = {
    users,
    channels,
    friends,
    myData,
    setUsers,
    setChannels,
    setFriends,
    setMyData,
  };

  return <MyContext.Provider value={value}>{children}</MyContext.Provider>;
};

export function useMyContext() {
  const context = useContext(MyContext);
  return context;
}