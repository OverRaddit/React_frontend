import React, { useState } from 'react';

const XPage = () => {
  const [chatHistory, setChatHistory] = useState([]);
  const [currentChat, setCurrentChat] = useState('');

  const handleChatChange = (e) => {
    setCurrentChat(e.target.value);
  };

  const handleChatSubmit = (e) => {
    e.preventDefault();
    if (currentChat.trim() !== '') {
      setChatHistory([...chatHistory, currentChat]);
      setCurrentChat('');
    }
  };

  return (
    <div className="x-page">
      <div className="x-page-top">
        <button>Normal Button</button>
        <button>Expand Button</button>
      </div>
      <div className="x-page-bottom">
        <div className="chat-history-box">
          <ul>
            {chatHistory.map((chat, index) => (
              <li key={index}>{chat}</li>
            ))}
          </ul>
        </div>
        <form onSubmit={handleChatSubmit}>
          <input
            type="text"
            value={currentChat}
            onChange={handleChatChange}
            placeholder="Type your chat here"
          />
        </form>
      </div>
    </div>
  );
};

export default XPage;
