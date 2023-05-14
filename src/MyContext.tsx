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
  currentChannel: MyChannel | null;
  mapChannels: Map<string, MyChannel>;
  friends: MyFriend[];
  myData: MyData | null;
  mySocket: MySocket | null;
  myInvite: MyInvite[];
  setUsers: (users: MyUser[]) => void;
  setChannels: (channels: MyChannel[]) => void;
  setCurrentChannel: (channel: MyChannel | null) => void;
  setMapChannels: (mapChannels: Map<string, MyChannel>) => void;
  setFriends: (friends: MyFriend[]) => void;
  setMyData: (myData: MyData | null) => void;
  setMySocket: (mySocket: MySocket | null) => void;
  setMyInvite: (myInvite: MyInvite[]) => void;
  removeInvite: () => void;
  initSocket: () => void;
};

export interface EventResponse {
  success: boolean;
  message: string;
  data: any[];
}

const defaultMyContext = {
  users: [],
  channels: [],
  currentChannel: null,
  mapChannels: new Map<string, MyChannel>(),
  friends: [],
  myData: null,
  mySocket: null,
  myInvite: [],
  setUsers: () => {},
  setChannels: () => {},
  setCurrentChannel: () => {},
  setMapChannels: () => {},
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
  const [currentChannel, setCurrentChannel] = useState<MyChannel | null>(null);
  const [mapChannels, setMapChannels] = useState<Map<string, MyChannel>>(new Map<string, MyChannel>());
  const [friends, setFriends] = useState<MyFriend[]>([]);
  const [myData, setMyData] = useState<MyData | null>(null);
  const [mySocket, setMySocket] = useState<MySocket | null>(null);
  const [myInvite, setMyInvite] = useState<MyInvite[]>([]);
  const [cookies, setCookie, removeCookie] = useCookies(['session_key']);

  const initSocket = () => {
    console.log('@@@initSocket in MyContext (intraId, userId): ', myData!.intraid, ',', myData!.id.toString());
    const ChatSocket = io('http://localhost:4242/chat', {
      extraHeaders: {
        foo:'bar',
        Authorization: `Bearer ${cookies.session_key}`,
				session_key: cookies.session_key,
        intraId: myData!.intraid,
        userId: myData!.id.toString(),
      },
    });

    const GameSocket = io("http://localhost:8000", {
      extraHeaders: {
        foo:'bar',
        Authorization: `Bearer ${cookies.session_key}`,
        session_key: cookies.session_key,
        intraId: myData!.intraid,
        userId: myData!.id.toString(),
      },
    });

    ChatSocket.on('initChannels', (response: EventResponse) => {
      console.log("chating 초기화", response);
      if (!response.success) console.log(response.message);
      else {
        response.data.forEach((channel: MyChannel) => {
          mapChannels.set(channel.name, channel);
        })
        //console.log('mapChannels: ', mapChannels);
        const X = response.data.map((channel) => {
          return { ...channel, chatHistory: [] }
        });

        setChannels(X);
      }
    });

    GameSocket.on('connect', () => {
      console.log("Game socket Id", GameSocket.id);
    });

    ChatSocket.on('auth_error', (response) => {
      console.log(response);
    });

    ChatSocket.on('user-channel-invited', (response) => {
      console.log('user-channel-invited res: ', response);
      const { channel, clientUser } = response;
      const channelType = 2;
      const transformedUser = { ...clientUser, intraId: clientUser.intraid };
      setMyInvite((prevInvites) => [
        ...prevInvites,
        {
          type: channelType,
          user: transformedUser,
          channel,
        },
      ]);
    });

    ChatSocket.on('user-join', (response) => {
      console.log('user-join from MyContext');
      const { roomName, clientUser } = response;
      console.log('user-join res: ', response);

      setChannels((prevChannels) => {
        return prevChannels.map((channel) => {
          if (channel.name === roomName) {
            return {
              ...channel,
              users: [...channel.users, clientUser],
            };
          }
          return channel;
        });
      });
    });

    ChatSocket.on('user-left', (response) => {
      const { roomName, clientUser } = response;
      console.log('user-left res: ', response);

      setChannels((prevChannels) => {
        return prevChannels.map((channel) => {
          if (channel.name === roomName) {
            return {
              ...channel,
              users: channel.users.filter(user => user.id !== clientUser.id),
            };
          }
          return channel;
        });
      });
    });

    ChatSocket.on('dm', (response) => {
      const { roomName, user, message } = response;
      console.log('dm response:', response);

      setChannels((prevChannels) => {
        const channelIndex = prevChannels.findIndex(channel => channel.name === roomName);
        if (channelIndex !== -1) {
          const chatMessage = `${user.nickname} : ${message}`;
          const updatedChannel = {
            ...prevChannels[channelIndex],
            chatHistory: [...prevChannels[channelIndex].chatHistory, chatMessage]
          };

          return [
            ...prevChannels.slice(0, channelIndex),
            updatedChannel,
            ...prevChannels.slice(channelIndex + 1)
          ];
        }

        return prevChannels;
      });
    });


    GameSocket.on('invite message', (response) => {
      const { user, gameType } = response;
      console.log("USER", user);

      const transformedUser = { ...user, intraId: user.intraid };

      setMyInvite((prevInvites) => [
        ...prevInvites,
        {
          type: gameType,
          user: transformedUser,
        },
      ]);
    });

    setMySocket({ chatSocket:ChatSocket, gameSocket:GameSocket });
  };
  const removeInvite = () => {
    setMyInvite(myInvite.slice(1));
  };

  const value = {
    users,
    channels,
    currentChannel,
    mapChannels,
    friends,
    myData,
    mySocket,
    myInvite,
    setUsers,
    setChannels,
    setCurrentChannel,
    setMapChannels,
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

