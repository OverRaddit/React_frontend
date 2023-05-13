import React, { FC } from 'react';
import Modal from 'react-modal';
import { useMyContext } from '../MyContext';

const InviteModal: FC = () => {
  const { myInvite, setMyInvite, mySocket, myData, removeInvite } = useMyContext();

  const handleEvent = (type: number) => {
    switch (type) {
      case 0:

        console.log("TEST",myInvite[0].user.intraId);
        mySocket?.gameSocket.emit('Accept invitation',  {myIntraId: myData?.intraid, oppintraId: myInvite[0].user.intraId,  gameType:0} );
        setMyInvite(myInvite.slice(1));
        break;
      case 1:
        
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
