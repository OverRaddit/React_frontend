import React, { useState, useRef, useEffect } from 'react';
import './XPage.css'

const XPage = ({ chatHistory, onChatSubmit, onChatChange, currentChat }) => {
  // const [chatHistory, setChatHistory] = useState(chats);
  // const [currentChat, setCurrentChat] = useState('');

  const chatHistoryRef = useRef(null); // new2
  console.log("hia");
  // const handleChatChange = (e) => {
  //   setCurrentChat(e.target.value);
  // };

  // const handleChatSubmit = (e) => {
  //   e.preventDefault();
  //   if (currentChat.trim() !== '') {
  //     setChatHistory([...chatHistory, currentChat]);
  //     setCurrentChat('');
  //   }
  // };

  useEffect(() => {
    const chatHistoryBox = chatHistoryRef.current;
    const gap = chatHistoryBox.scrollHeight - chatHistoryBox.scrollTop
    console.log('gap: ', gap);
    if (gap < 230)
      chatHistoryBox.scrollTop = chatHistoryBox.scrollHeight;
  }, [chatHistory]);

  return (
    <div className="x-page">
      <div className="x-page-top">
        <button>Normal Button</button>
        <button>Expand Button</button>
      </div>
      <div className="x-page-bottom">
        <div
          className="chat-history-box"
          ref={chatHistoryRef}
          // onScroll={handleScroll}
        >
          <ul>
            {chatHistory.map((chat, index) => (
              <li key={index}>{chat}</li>
            ))}
          </ul>
        </div>
        <form onSubmit={onChatSubmit}>
          <input
            className='chat-input-box'
            type="text"
            value={currentChat}
            onChange={onChatChange}
            placeholder="Type your chat here"
          />
          <button type="submit">Send</button>
        </form>
      </div>
    </div>
  );
};

export default XPage;
