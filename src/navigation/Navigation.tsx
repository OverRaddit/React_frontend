import { FC, useEffect } from 'react';
import { useState } from 'react';
import { Link } from 'react-router-dom';
import Modal from 'react-modal';
import { MyChannel, MyFriend } from './interfaces/interfaces';
import './Navigation.css';
import { EventResponse, useMyContext } from '../MyContext';
import axios from 'axios';
import ChannelSearch from './ChannelSearch';
import FriendModal from './FriendModal';
import ChatUserModal from './ChatUserModal';
import { resolve } from 'path';
import InviteModal from './InviteModal';

type ListName = 'friends' | 'channels';

const Navigation: FC = () => {
  const [showList, setShowList] = useState<ListName>('friends');
  const [expandedChannels, setExpandedChannels] = useState<Set<number>>(new Set());
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [channelToLeave, setChannelToLeave] = useState<MyChannel | null>(null);
  const [selectedUser, setSelectedUser] = useState<any | null>(null);
  const [selectedUserChannel, setSelectedUserChannel] = useState<any | null>(null);
  const { myData, setMyData, friends, setFriends, channels, setChannels, initSocket, mySocket } = useMyContext();
  const [modalMessage, setModalMessage] = useState<string | null>(null);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        if (!myData) {
          const response = await axios.get(
            `http://localhost:3000/user`, { withCredentials: true }
          );
          setMyData(response.data);
        }
        if (!friends) {
          const response2 = await axios.get(
            `http://localhost:3000/friendlist`, { withCredentials: true }
          );
          setFriends(response2.data);
        }
      } catch (error) {
        console.error('Failed to fetch user data:', error);
      }
    };
    fetchUserData();
  }, [setMyData, setFriends, initSocket, friends, myData]);

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
                  return { ...channelUser, isOwner: true };
                }
                if (channelUser.isOwner) {
                  return { ...channelUser, isOwner: false, isAdmin: false };
                }
                return channelUser;
              }),
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
                    return { ...channelUser, isAdmin: true };
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
                  return { ...channelUser, isAdmin: false };
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
              users: channel.users.filter((channelUser) => channelUser.intraId !== user.intraid),
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
                  users: channel.users.filter((channelUser) => channelUser.intraId !== user.intraid),
                };
              }
              return channel;
            })
          );
        }
      });

      mySocket.chatSocket.on('chat', (response) => {
        console.log(response);
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

      mySocket.chatSocket.on('user-dm', (response) => {
        console.log('user-dm: ', response);
        console.log('channels: ', channels);
        const newChannels = [...channels, response];
        console.log('newChannels: ', newChannels);
        setChannels(newChannels);
      });

      // mySocket.chatSocket.on('user-join', ( response: EventResponse ) => {
      //   console.log('user-join from Nav');
      //   return; // 일단 사용금지.
      //   // if (!response.success) return;

      //   // const newChannels = {
      //   //   ...channels,
      //   //   chatHistory: [...channels[channelIndex].chatHistory, 'You: ' + currentChat]
      //   // };

      //   // const updatedChannels = [
      //   //   ...channels,
      //   //   response.data
      //   // ];

      //   // console.log('update complete');
      //   // setChannels(updatedChannels);
      // });

    return () => {
      mySocket.chatSocket.off('owner-granted');
      mySocket.chatSocket.off('admin-granted');
      mySocket.chatSocket.off('admin-revoked');
      mySocket.chatSocket.off('user-banned');
      mySocket.chatSocket.off('user-kicked');
      mySocket.chatSocket.off('chat');
      mySocket.chatSocket.off('user-muted');
      mySocket.chatSocket.off('user-dm');
      //mySocket.chatSocket.off('user-join');
    };
    }
  }, [myData, initSocket, mySocket, channels, setChannels]);

  const openModal = (channel: MyChannel) => {
    setChannelToLeave(channel);
    setIsModalOpen(true);
  };

  const confirmLeave = () => {
    if (channelToLeave && mySocket) {
      setChannels(channels.filter((channel) => channel.id !== channelToLeave.id));
      mySocket.chatSocket.emit('leftChannel', { roomName: channelToLeave.name });
    }
    setIsModalOpen(false);
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

  const renderChannelList = () => {
    return (
      <ul className="channel-list">
        {<span>채널수: {channels.length}</span>}
        {channels.map((channel) => (
          <li key={channel.id} className="channel">
            <div className="channel-info">
              <span>{channel.name}</span>
              <button onClick={() => toggleUserList(channel.id)}>+</button>
              <button
                className="leave-channel-btn"
                onClick={() => openModal(channel)}
              >
                Leave
              </button>
            </div>
            {channel.showUserList && (
              <ul className="user-list">
                {channel.users
                  .sort((a, b) => {
                    if (a.isOwner && !b.isOwner) return -1;
                    if (!a.isOwner && b.isOwner) return 1;
                    if (a.isAdmin && !b.isAdmin) return -1;
                    if (!a.isAdmin && b.isAdmin) return 1;
                    return a.nickname.localeCompare(b.nickname);
                  })
                  .map((user: any) => (
                    <li
                    key={user.id}
                    onClick={() => handleUserClick(user, channel)}
                  >
                      {user.nickname}
                      {user.isOwner ? ' (O)' : user.isAdmin ? ' (A)' : ''}
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
      (user: any) => user.intraId === myData?.intraid
    );
  };

  const handleUserClick = (user: any, channel: any) => {
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
      if (a.status === b.status) {
        if (a.status === 'online') {
          return a.nickname.localeCompare(b.nickname);
        } else if (a.status === 'in-queue') {
          if (b.status === 'online') return 1;
          return -1;
        } else if (a.status === 'in-game') {
          if (b.status === 'online' || b.status === 'in-queue') return 1;
          return -1;
        } else {
          return a.nickname.localeCompare(b.nickname);
        }
      } else {
        if (a.status === 'online') return -1;
        if (b.status === 'online') return 1;
        if (a.status === 'in-queue') return -1;
        if (b.status === 'in-queue') return 1;
        if (a.status === 'in-game') return -1;
        if (b.status === 'in-game') return 1;
        return a.nickname.localeCompare(b.nickname);
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
          <span>{friend.nickname} ({friend.status})</span>
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
        <img className="nav_profile-picture" src={myData?.avatar} alt="Profile" />
        <span>{myData?.nickname}</span>
      </div>

      {/* Button group */}
      <div className="button-group">
        <Link to="/"><button>X</button></Link>
        <Link to="/game"><button>Y</button></Link>
        <Link to="/c"><button>Z</button></Link>
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
          channelId={selectedUserChannel.name} // TODO: 이름 잘못됨
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

      <InviteModal />

  </div>
  );
};

export default Navigation;
