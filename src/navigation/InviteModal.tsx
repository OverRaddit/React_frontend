import React, { FC } from 'react';
import Modal from 'react-modal';
import { useMyContext } from '../MyContext';

const InviteModal: FC = () => {
  const { myInvite, removeInvite } = useMyContext();

  const handleEvent = (type: number) => {
    // Handle events based on the type
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
