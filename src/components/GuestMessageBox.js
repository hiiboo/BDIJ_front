import React, { useState } from 'react';
import GuestMessageDetail from './GuestMessageDetail';

function GuestMessageBox() {
  const [messages, setMessages] = useState([
    {
      id: 1,
      sender: 'John',
      senderIcon: 'URL_TO_JOHN_ICON',
      message: 'ガイドの依頼です。',
    },
    {
      id: 2,
      sender: 'Alice',
      senderIcon: 'URL_TO_Alice_ICON',
      message: 'ツアーの日程を教えてください。',
    },
  ]);

  const [selectedMessage, setSelectedMessage] = useState(null);
  const [newMessage, setNewMessage] = useState('');

  const sendMessage = () => {
    if (newMessage.trim() === '') {
      return;
    }

    const newId = Math.max(...messages.map((message) => message.id), 0) + 1;
    const newMessageObj = {
      id: newId,
      sender: 'You',
      message: newMessage,
    };

    setMessages([...messages, newMessageObj]);
    setNewMessage('');
  };

  return (
    <div>
      <h2>Guestメッセージボックス</h2>
      <div className="message-list">
        {messages.map((message) => (
          <div
            key={message.id}
            className="message"
            onClick={() => setSelectedMessage(message)}
          >
            <strong>{message.sender}:</strong> {message.message}
          </div>
        ))}
      </div>

      {selectedMessage && <GuestMessageDetail message={selectedMessage} />}
    </div>
  );
}

export default GuestMessageBox;