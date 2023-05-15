import React, { FC } from 'react';
import Modal from 'react-modal';
import { EventResponse, useMyContext } from '../MyContext';

const InviteModal: FC = () => {
  const { myInvite, setMyInvite, mySocket, myData, removeInvite, channels, setChannels, setCurrentChannel } = useMyContext();

  const handleEvent = (type: number) => {
    switch (type) {
      case 0:
        mySocket?.gameSocket.emit('Accept invitation',  {myIntraId: myData?.intraid, oppintraId: myInvite[0].user.intraid,  gameType:0} );
        setMyInvite(myInvite.slice(1));
        break;
      case 1:
        mySocket?.gameSocket.emit('Accept invitation',  {myIntraId: myData?.intraid, oppintraId: myInvite[0].user.intraid,  gameType:1} );
        setMyInvite(myInvite.slice(1));
        break;
      case 2:
        const data: any = myInvite[0];
        mySocket?.chatSocket?.emit('invitedChannel', { userId: myData?.id, roomName: data?.channel?.roomname }, (response: EventResponse) => {
          if (!response.success) {
            console.log('An error occurred.');
            return;
          }

          // 이거 왜 추가가 안되냐;;
          const newChannel = response.data[0];
          newChannel.setChatHistory = [];
          newChannel.showUserList = false;

          setChannels([...channels, newChannel]);
          setCurrentChannel(newChannel);
        });
        setMyInvite(myInvite.slice(1));
      break;

      default:
        break;
    }
  };

  return (
    <Modal
      isOpen={myInvite.length > 0}
      onRequestClose={removeInvite}
      contentLabel="Invite Modal"
    >
      <h2>Invitation</h2>
      {myInvite[0] && (
        <>
          {myInvite[0].type === 0 && <p>Content for type 0</p>}
          {myInvite[0].type === 1 && <p>Content for type 1</p>}
          {myInvite[0].type === 2 && <p>Content for type 2</p>}
          {myInvite[0].type === 3 && <p>Content for type 3</p>}
        </>
      )}
      <button onClick={() => handleEvent(myInvite[0].type)}>Accept</button>
      <button onClick={removeInvite}>Decline</button>
    </Modal>
  );
};

export default InviteModal;
