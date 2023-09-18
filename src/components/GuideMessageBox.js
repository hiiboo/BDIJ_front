import React, { useState } from 'react';

function GuideMessageBox() {
  // メッセージの一覧をステートとして保持
  const [messages, setMessages] = useState([
    {
      id: 1,
      sender: 'John',
      message: 'ガイドの依頼です。',
    },
    {
      id: 2,
      sender: 'Alice',
      message: 'ツアーの日程を教えてください。',
    },
  ]);

  // 新しいメッセージを入力するためのステート
  const [newMessage, setNewMessage] = useState('');

  // 新しいメッセージを送信する関数
  const sendMessage = () => {
    if (newMessage.trim() === '') {
      return; // 空のメッセージは送信しない
    }

    const newId = Math.max(...messages.map((message) => message.id), 0) + 1;
    const newMessageObj = {
      id: newId,
      sender: 'You', // ユーザー自身が送信したメッセージ
      message: newMessage,
    };

    setMessages([...messages, newMessageObj]);
    setNewMessage(''); // 入力フィールドをクリア
  };

  return (
    <div>
      <h2>メッセージボックス</h2>
      <div className="message-list">
        {messages.map((message) => (
          <div key={message.id} className="message">
            <strong>{message.sender}:</strong> {message.message}
          </div>
        ))}
      </div>
      <div className="message-input">
        <input
          type="text"
          placeholder="メッセージを入力..."
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
        />
        <button onClick={sendMessage}>送信</button>
      </div>
    </div>
  );
}

export default GuideMessageBox;