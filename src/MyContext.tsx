import React, { createContext, useContext, useState } from 'react';
import { MyUser, MyChannel, MyFriend, MyData, MyInvite } from './navigation/interfaces/interfaces';
import io, { Socket } from 'socket.io-client';
import { useCookies } from 'react-cookie';
import { Navigate, useNavigate } from 'react-router-dom';

interface MySocket {
  chatSocket: Socket;
  gameSocket: Socket;
}

type MyContextProps = {
  users: MyUser[];
  userBlackList: MyFriend[];
  channels: MyChannel[];
  currentChannel: MyChannel | null;
  mapChannels: Map<string, MyChannel>;
  friends: MyFriend[];
  myData: MyData | null;
  mySocket: MySocket | null;
  myInvite: MyInvite[];
  setUsers: (users: MyUser[]) => void;
  setUserBlackList: (users: MyFriend[]) => void;
  setChannels: (channels: MyChannel[]) => void;
  setCurrentChannel: (channel: MyChannel | null) => void;
  setMapChannels: (mapChannels: Map<string, MyChannel>) => void;
  setFriends: (friends: MyFriend[]) => void;
  setMyData: (myData: MyData | null) => void;
  setMySocket: (mySocket: MySocket | null) => void;
  setMyInvite: (myInvite: MyInvite[]) => void;
  removeInvite: () => void;
  initSocket: (cookies:any) => void;
};

export interface EventResponse {
  success: boolean;
  message: string;
  data: any[];
}

const defaultMyContext = {
  users: [],
  userBlackList: [],
  channels: [],
  currentChannel: null,
  mapChannels: new Map<string, MyChannel>(),
  friends: [],
  myData: null,
  mySocket: null,
  myInvite: [],
  setUsers: () => {},
  setUserBlackList: () => {},
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
  const [userBlackList, setUserBlackList] = useState<MyFriend[]>([]);
  const [channels, setChannels] = useState<MyChannel[]>([]);
  const [currentChannel, setCurrentChannel] = useState<MyChannel | null>(null);
  const [mapChannels, setMapChannels] = useState<Map<string, MyChannel>>(new Map<string, MyChannel>());
  const [friends, setFriends] = useState<MyFriend[]>([]);
  const [myData, setMyData] = useState<MyData | null>(null);
  const [mySocket, setMySocket] = useState<MySocket | null>(null);
  const [myInvite, setMyInvite] = useState<MyInvite[]>([]);
  const navigate = useNavigate();
  

  const initSocket = (cookies:any) => {
    //console.log('@@@initSocket in MyContext (intraId, userId): ', myData!.intraid, ',', myData!.id.toString());
    //console.log(':)cookies:',cookies);
    //console.log(':)cookies userdata:',cookies.userData);
    //console.log(':)cookies intraid:',cookies.userData.intraid);
    //console.log(':)cookies id:',cookies.userData.id.toString());

    // const ChatSocket = io('http://localhost:4242/chat', {
    const ChatSocket = io(`${process.env.REACT_APP_CHAT_SERVER}`, {
      extraHeaders: {
        Authorization: `Bearer ${cookies.session_key}`,
				session_key: cookies.session_key,
        intraId: cookies?.userData.intraid,
        userId: cookies?.userData.id.toString(),
      },
    });
    // const GameSocket = io("http://localhost:8000", {
    const GameSocket = io(`${process.env.REACT_APP_GAME_SERVER}`, {
      extraHeaders: {
        Authorization: `Bearer ${cookies.session_key}`,
        session_key: cookies.session_key,
        intraId: cookies.userData.intraid,
        userId: cookies.userData.id,
      },
    });

    ChatSocket.on('disconnect', () => {
      //console.log('Disconnected');
      navigate('/login');

    });
    GameSocket.on('disconnect', () => {
      //console.log('Disconnected');
      navigate('/login');
    });
    ChatSocket.on('initChannels', (response: EventResponse) => {
      //console.log("chating 초기화", response);
      // if (!response.success) //console.log(response.message);
      // else {
      if (response.success){
        response.data.forEach((channel: MyChannel) => {
          mapChannels.set(channel.name, channel);
        })
        ////console.log('mapChannels: ', mapChannels);
        const X = response.data.map((channel) => {
          return { ...channel, chatHistory: [] }
        });

        setChannels(X);
      }
    });

    ChatSocket.on('getBlacklist', (response: EventResponse) => {
      //console.log("getBlacklist", response);
      // if (!response.success) //console.log(response.message);

      // setUserBlackList(response.data);
      const userBlackList = response.data.map((user) => {
        return user.userId3;
      });
      setUserBlackList(userBlackList);
      //console.log('userBlackList:', userBlackList);
    });

    GameSocket.on('connect', () => {
      //console.log("Game socket Id", GameSocket.id);
    });

    ChatSocket.on('auth_error', (response) => {
      //console.log(response);
    });

    ChatSocket.on('user-channel-invited', (response) => {
      //console.log('user-channel-invited res: ', response);
      const { channel, clientUser } = response;
      const channelType = 2;
      setMyInvite((prevInvites) => {
        // 이미 동일한 type과 user를 가진 요소가 있는지 확인
        if (prevInvites.some(invite => invite.type === channelType && invite.user.intraid === clientUser.intraid)) {
          //console.log('The invite already exists!');
          return prevInvites;
        }
        return [
          ...prevInvites,
          {
            type: channelType,
            user: clientUser,
            channel,
          },
        ];
      });
    });

    ChatSocket.on('user-join', (response) => {
      //console.log('user-join from MyContext');
      const { roomName, clientUser } = response;
      //console.log('user-join res: ', response);

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
      //console.log('user-left res: ', response);

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
      //console.log('dm response:', response);

      // response.user가 userBlackList에 존재하는지 검색한다.
      const blackedUser = userBlackList.find(user => user.id === response.user.id);
      //console.log('blackedUser: ',blackedUser);
      if (blackedUser !== undefined) {
        //console.log('이 메시지는 무시됩니다.')
        return ;
      }

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

    ChatSocket.on('user-state', (response) => {
      const { userId, status } = response;
      //console.log('user-state res: ', response);

      setFriends((prevFriends) => {
        return prevFriends.map((friend) => {
          if (friend.id === userId) {
            return {
              ...friend,
              status
            };
          }
          return friend;
        })
      })

      // setChannels((prevChannels) => {
      //   return prevChannels.map((channel) => {
      //     if (channel.name === roomName) {
      //       return {
      //         ...channel,
      //         users: channel.users.filter(user => user.id !== clientUser.id),
      //       };
      //     }
      //     return channel;
      //   });
      // });
    });

    GameSocket.on('invite message', (response) => {
      const { user, gameType } = response;
      setMyInvite((prevInvites) => {
        // 이미 동일한 type과 user를 가진 요소가 있는지 확인
        if (prevInvites.some(invite => invite.type === gameType && invite.user.intraid === user.intraid)) {
          //console.log('The invite already exists!');
          return prevInvites;
        }

        // 중복이 없을 경우 새로운 요소를 추가
        return [
          ...prevInvites,
          {
            type: gameType,
            user: user,
          },
        ];
      });
    });

    GameSocket.on('clickbackspace', (response) => {
      ChatSocket.emit('state', { userId: myData?.id, status: 'online' }, (response: EventResponse) => {
        //console.log('state: ', response);
      })
    });

    setMySocket({ chatSocket:ChatSocket, gameSocket:GameSocket });
  };

  const removeInvite = () => {
    setMyInvite(myInvite.filter(invite => !(invite.user === myInvite[0]?.user && invite.type === myInvite[0]?.type)));
  };

  const value = {
    users,
    userBlackList,
    channels,
    currentChannel,
    mapChannels,
    friends,
    myData,
    mySocket,
    myInvite,
    setUsers,
    setUserBlackList,
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

