import { FC, useEffect } from 'react';
import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import Modal from 'react-modal';
import { MyChannel, MyFriend, MyUser } from './interfaces/interfaces';
import './Navigation.css';
import { useMyContext } from '../MyContext';
import axios from 'axios';
import ChannelSearch from './ChannelSearch';
import FriendModal from './FriendModal';
import ChatUserModal from './ChatUserModal';
import InviteModal from './InviteModal';

type ListName = 'friends' | 'channels';

const Navigation: FC = () => {
  const [showList, setShowList] = useState<ListName>('friends');
  const [expandedChannels, setExpandedChannels] = useState<Set<number>>(new Set());
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [channelToLeave, setChannelToLeave] = useState<MyChannel | null>(null);
  const [selectedUser, setSelectedUser] = useState<any | null>(null);
  const [selectedUserChannel, setSelectedUserChannel] = useState<any | null>(null);
  const { myData, setMyData, friends, setFriends, channels, setChannels, initSocket, mySocket, setCurrentChannel, userBlackList, setUserBlackList } = useMyContext();
  const [modalMessage, setModalMessage] = useState<string | null>(null);
  const navigate = useNavigate();
  const [inviteModalOpen, setInviteModalOpen] = useState(false);
  const [invitedFriends, setInvitedFriends] = useState<{ [key: number]: boolean }>({});
  const [channelName, setChannelName] = useState<String>('');

  const openInviteModal = (channelName:String) => {
    setChannelName(channelName);
    setInviteModalOpen(true);
  };

  const closeInviteModal = () => {
    setInviteModalOpen(false);
    setInvitedFriends({});
  };

  const handleChatInvite = (channel:MyChannel) => {
    console.log(channel);
    openInviteModal(channel.name);
  };

  const inviteFriend = (friendId:number) => {
    const data = {
      userId: friendId,
      roomName: channelName,
    };
    console.log(data);
    mySocket?.chatSocket.emit('channel-invite', data, (response:any) => {
      console.log('invite response:', response);
      setInvitedFriends(prev => ({
        ...prev,
        [friendId]: true,
      }));
    });
  };


  useEffect(() => {
    const fetchUserData = async () => {
      try {
        if (!myData) {
          const response = await axios.get(
            `http://localhost:3000/user`, { withCredentials: true }
          );
          setMyData(response.data);
        }
        if (friends.length === 0) {
          const response2 = await axios.get(
            `http://localhost:3000/friendlist`, { withCredentials: true }
            );
            setFriends(response2.data);
        }
      } catch (error) {
        console.error('Failed to fetch user data:', error);
        navigate('/login');
      }
    };
    fetchUserData();
  }, [setMyData, setFriends, myData]);

  useEffect(() => {
    if (myData && myData.intraid && myData.id && !mySocket) {
      initSocket();
    }
    if (myData && mySocket) {
      mySocket.chatSocket.on('owner-granted', ({ roomName, user }) => {
        if (user.intraid === myData?.intraid) {
          setModalMessage('You have been granted ownership of the ' + roomName);
        }
        setChannels(
          channels.map((channel) => {
            if (channel.name === roomName) {
              return {
                ...channel,
                users: channel.users.map((channelUser) => {
                  if (channelUser.id === user.id) {
                    return { ...channelUser, isowner: true };
                  }
                  if (channelUser.isowner) {
                    return { ...channelUser, isowner: false, isadmin: false };
                  }
                  return channelUser;
                }),
                owner: user.nickname,
              };
            }
            return channel;
          })
        );
      });

      mySocket.chatSocket.on('admin-granted', ({ roomName, user }) => {
        if (user.intraid === myData?.intraid) {
          setModalMessage('You have been granted admin of the ' + roomName);
        }
        setChannels(
          channels.map((channel) => {
            if (channel.name === roomName) {
              return {
                ...channel,
                users: channel.users.map((channelUser) => {
                  if (channelUser.id === user.id) {
                    return { ...channelUser, isadmin: true };
                  }
                  return channelUser;
                }),
              };
            }
            return channel;
          })
        );
      });

      mySocket.chatSocket.on('admin-revoked', ({ roomName, user }) => {
        if (user.intraid === myData?.intraid) {
          setModalMessage('You have been revoked admin of the ' + roomName);
        }
        setChannels(
        channels.map((channel) => {
          if (channel.name === roomName) {
            return {
              ...channel,
              users: channel.users.map((channelUser) => {
                if (channelUser.id === user.id) {
                  return { ...channelUser, isadmin: false };
                }
                return channelUser;
              }),
            };
          }
          return channel;
        })
      );
      });

      mySocket.chatSocket.on('user-banned', ({ roomName, user }) => {
      if (user.intraid === myData?.intraid) {
        setModalMessage('You have been banned of the ' + roomName);
        setChannels(channels.filter((channel) => channel.name !== roomName));
      }
      setChannels(
        channels.map((channel) => {
          if (channel.name === roomName) {
            return {
              ...channel,
              users: channel.users.filter((channelUser) => channelUser.intraid !== user.intraid),
            };
          }
          return channel;
        })
      );
      });

      mySocket.chatSocket.on('user-kicked', ({ roomName, user }) => {
        if (user.intraid === myData?.intraid) {
          setModalMessage('You have been kicked from the ' + roomName);
          // 채널리스트에서 해당 채팅방을 삭제합니다.
          setChannels(channels.filter((channel) => channel.name !== roomName));
        } else {
          // 다른 사용자가 추방된 경우, 해당 사용자만 채널리스트에서 삭제합니다.
          setChannels(
            channels.map((channel) => {
              if (channel.name === roomName) {
                return {
                  ...channel,
                  users: channel.users.filter((channelUser) => channelUser.intraid !== user.intraid),
                };
              }
              return channel;
            })
          );
        }
      });

      mySocket.chatSocket.on('chat', (response) => {
        console.log('chat:', response);

        // response.user가 userBlackList에 존재하는지 검색한다.
        const blackedUser = userBlackList.find(user => user.id === response.user.id);
        console.log('blackedUser: ',blackedUser);
        if (blackedUser !== undefined) {
          console.log('이 메시지는 무시됩니다.')
          return ;
        }

        // Find the index of the channel with the matching name
        const channelIndex = channels.findIndex(channel => channel.name === response.roomName);

        if (channelIndex !== -1) {
          // Create a new channel object with the updated chatHistory
          const chatMessage = `${response.user.nickname} : ${response.message}`;
          const updatedChannel = {
            ...channels[channelIndex],
            chatHistory: [...channels[channelIndex].chatHistory, chatMessage]
          };

          // Create a new channels array with the updated channel object
          const updatedChannels = [
            ...channels.slice(0, channelIndex),
            updatedChannel,
            ...channels.slice(channelIndex + 1)
          ];

          // Update the channels state
          setChannels(updatedChannels);
        }
      });

      mySocket.chatSocket.on('user-muted', ({ roomName, muteEndTimestamp }) => {
        setModalMessage('You have been muted from the Room <' + roomName + '> until <' + muteEndTimestamp + '>');
      });

      mySocket.chatSocket.on('user-dm', (response) => {
        console.log('user-dm: ', response);
        console.log('channels: ', channels);
        if (channels.some(channel => channel.name === response.name)) {
          console.log('The channel already exists!');
          return;
        }
        const newChannels = [...channels, response];
        console.log('newChannels: ', newChannels);
        setChannels(newChannels);
      });

      mySocket.chatSocket.on('channel-deleted', ({ roomName, owner }) => {
        console.log('roomName, owner : ', roomName, owner);
        setModalMessage(`Channel ${roomName}의 방장 ${owner.nickname}이/가 채널을 삭제했습니다.`);
        // 채널리스트에서 해당 채팅방을 삭제합니다.
        setChannels(channels.filter((channel) => channel.name !== roomName));
      });

    return () => {
      mySocket.chatSocket.off('owner-granted');
      mySocket.chatSocket.off('admin-granted');
      mySocket.chatSocket.off('admin-revoked');
      mySocket.chatSocket.off('user-banned');
      mySocket.chatSocket.off('user-kicked');
      mySocket.chatSocket.off('chat');
      mySocket.chatSocket.off('user-muted');
      mySocket.chatSocket.off('user-dm');
      mySocket.chatSocket.off('channel-deleted');
    };
    }
  }, [myData, initSocket, mySocket, channels, setChannels, setCurrentChannel]);

  const openModal = (channel: MyChannel) => {
    setChannelToLeave(channel);
    setIsModalOpen(true);
  };

  const confirmLeave = () => {
    if (channelToLeave && mySocket) {
      const data = {
        roomName: channelToLeave?.name,
      };
      if (channelToLeave.kind === 3) {
        setChannels(channels.filter((channel) => channel.id !== channelToLeave.id));
        setIsModalOpen(false);
        return;
      }
      mySocket?.chatSocket.emit('leftChannel', data, (response: any) => {
        console.log('leftChannel: ', response);
        setModalMessage(response.message);
        setIsModalOpen(false);

        if (!response.success) {
        return;
      }
        setChannels(channels.filter((channel) => channel.id !== channelToLeave.id));
      });}
  };

  const handleLeaveChannel = (channelId: any) => {
    const confirmLeave = window.confirm('Are you gonna leave?');
    if (confirmLeave) {
      setChannels(channels.filter(channel => channel.id !== channelId));
    }
  };

  const toggleUserList = (channelId: number) => {
    setChannels(
      channels.map((channel) =>
        channel.id === channelId
          ? { ...channel, showUserList: !channel.showUserList }
          : channel
      )
    );
  };

  // const handleChatInvite = (channel: any) => {
  //   console.log(channel);
  //   const data = {
  //     userId: '2',
  //     roomName: channel.name,
  //   };
  //   mySocket?.chatSocket.emit('channel-invite', data, (response : any) => {
  //     console.log('invite response:', response);
  //   })
  // };

  const location = useLocation();
  const onClickChannelName = (channel:MyChannel) => {
    const newPath = `/main/${channel.name}`;

    if (location.pathname !== newPath) {
      navigate(newPath);
    }
  }

  const renderChannelList = () => {
    return (
      <ul className="channel-list">
        {<span>채널수: {channels.length}</span>}
        {channels.map((channel) => (
          <li key={channel.id} className="channel">
            <div className="channel-info">
            <span onClick={() => onClickChannelName(channel)}>
              {channel.name}
            </span>
              <button onClick={() => toggleUserList(channel.id)}>+</button>
              <button
                className="leave-channel-btn"
                onClick={() => openModal(channel)}
              >
                ❌
              </button>
              {channel.kind !== 3 && (
                <button onClick={() => handleChatInvite(channel)}>📧</button>
              )}
            </div>
            {channel.showUserList && (
              <ul className="user-list">
                {channel.users
                  .sort((a, b) => {
                    if (a.isowner && !b.isowner) return -1;
                    if (!a.isowner && b.isowner) return 1;
                    if (a.isadmin && !b.isadmin) return -1;
                    if (!a.isadmin && b.isadmin) return 1;
                    return a.nickname.localeCompare(b.nickname);
                  })
                  .map((user: any) => (
                    <li
                    key={user.id}
                    onClick={() => handleUserClick(user, channel)}
                  >
                      {user.nickname}
                      {user.isowner ? ' (👑)' : user.isadmin ? ' (⚔️)' : ''}
                    </li>
                  ))}
              </ul>
            )}
          </li>
        ))}
      </ul>
    );
  };

  const findMyChannelData = (channel: any) => {
    return channel.users.find(
      (user: any) => user.intraid === myData?.intraid
    );
  };

  const handleUserClick = (user: any, channel: any) => {
    if(channel.kind === 3) { return; }
    setSelectedUser(user);
    setSelectedUserChannel(channel);
  };

  const handleListSwitch = (listName: ListName) => {
    setShowList(listName);
  };

  const toggleChannelExpansion = (index: number) => {
    const newExpandedChannels = new Set(expandedChannels);
    if (newExpandedChannels.has(index)) {
      newExpandedChannels.delete(index);
    } else {
      newExpandedChannels.add(index);
    }
    setExpandedChannels(newExpandedChannels);
  };

  const [selectedFriend, setSelectedFriend] = useState<MyFriend | null>(null);

  const handleFriendClick = (friend: MyFriend) => {
    setSelectedFriend(friend);
  };

  const renderFriendsList = () => {
    if (friends.length === 0) {
      return <div>No friends found</div>;
    }

    const sortedFriends = friends.sort((a, b) => {
      // Treat undefined status as 'offline'
      const statusA = a.status || 'offline';
      const statusB = b.status || 'offline';

      if (statusA === statusB) {
        return a.nickname.localeCompare(b.nickname);
      } else {
        if (statusA === 'online') return -1;
        if (statusB === 'online') return 1;
        if (statusA === 'in-queue') return -1;
        if (statusB === 'in-queue') return 1;
        if (statusA === 'in-game') return -1;
        if (statusB === 'in-game') return 1;
        return 1;
      }
    });

    return (
      <ul className="friends-list">
      {sortedFriends.map((friend) => (
        <li
          key={friend.id}
          className="friend"
          onClick={() => handleFriendClick(friend)}
        >
          <span>{friend.nickname} ({friend.status || 'offline'})</span>
        </li>
      ))}
    </ul>
  );
  };

  const handleChannelSearch = (searchQuery: any) => {
    // Implement channel search
  };

  return (
    <div className="Navigation" id="navigation">
      <div className="container">
      <div className="profile-row">
      <Link to="/profile">
        <img className="nav_profile-picture" src={myData?.avatar} alt="Profile" />
        <span>{myData?.nickname}</span>
      </Link>
      </div>

      {/* Button group */}
      <div className="button-group">
        <button onClick={() => handleListSwitch('friends')}>Friends</button>
        <button onClick={() => handleListSwitch('channels')}>Channels</button>
      </div>

      {/* List rendering */}
      <>
        {showList === 'friends' && renderFriendsList()}
        {showList === 'channels' && renderChannelList()}
      </>

      {/* Channel search */}
      <div className="search-container">
        <ChannelSearch />
      </div>

      </div>
      <Modal
        isOpen={isModalOpen}
        onRequestClose={() => setIsModalOpen(false)}
        contentLabel="Leave Channel Modal"
      >
        <h2>Are you sure you want to leave the channel?</h2>
        <button onClick={confirmLeave}>Yes</button>
        <button onClick={() => setIsModalOpen(false)}>No</button>
      </Modal>

      {selectedFriend && (
        <FriendModal
        friend={selectedFriend}
        onClose={() => setSelectedFriend(null)}
      />
      )}

      {selectedUser && selectedUserChannel && (
        <ChatUserModal
          user={selectedUser}
          myChannelData={findMyChannelData(selectedUserChannel)}
          onClose={() => setSelectedUser(null)}
          isOpen={selectedUser !== null}
          channelId={selectedUserChannel.name}
        />
      )}
      <Modal
        isOpen={modalMessage !== null}
        onRequestClose={() => setModalMessage(null)}
        contentLabel="Notification Modal"
      >
        <h2>{modalMessage}</h2>
        <button onClick={() => setModalMessage(null)}>OK</button>
      </Modal>

      <Modal isOpen={inviteModalOpen} onRequestClose={closeInviteModal}>
        <ul>
          {friends.map(friend => (
            <li key={friend.id}>
              <span>{friend.nickname} - {friend.status}</span>
              {invitedFriends[friend.id]
                ? <span>초대됨</span>
                : <button onClick={() => inviteFriend(friend.id)}>초대</button>
              }
            </li>
          ))}
        </ul>
      </Modal>

      <InviteModal />

  </div>
  );
};

export default Navigation;
