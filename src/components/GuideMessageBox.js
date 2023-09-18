import React, { useState } from 'react';
import GuestMessageDetail from './GuestMessageDetail'; // ゲストメッセージ詳細コンポーネントをインポート

function GuideMessageBox() {
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
    // 他のゲストからのメッセージも同様に追加
  ]);

  const [selectedMessage, setSelectedMessage] = useState(null);
  const [newMessage, setNewMessage] = useState('');
  const [guests, setGuests] = useState([]); // ゲストごとのチャット情報を管理

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

  const handleStartChat = (guestId) => {
    // ゲストとのチャットを開始
    const guest = guests.find((g) => g.id === guestId);
    if (guest) {
      guest.chat = [
        {
          sender: 'Guest',
          message: 'こんにちは、ガイドさん！',
        },
      ];
    } else {
      // ゲスト情報を新規作成
      const newGuest = {
        id: guestId,
        chat: [
          {
            sender: 'Guest',
            message: 'こんにちは、ガイドさん！',
          },
        ],
        draftMessage: '', // チャットメッセージの初期値を設定
      };
      setGuests([...guests, newGuest]);
    }
  };

  const handleChatInputChange = (e, guestId) => {
    const guestIndex = guests.findIndex((g) => g.id === guestId);
    if (guestIndex !== -1) {
      guests[guestIndex].draftMessage = e.target.value;
    }
  };

  const sendChatMessage = (guestId) => {
    const guestIndex = guests.findIndex((g) => g.id === guestId);
    if (guestIndex !== -1 && guests[guestIndex].draftMessage) {
      const newChat = {
        sender: 'You',
        message: guests[guestIndex].draftMessage,
      };

      guests[guestIndex].chat = [...(guests[guestIndex].chat || []), newChat];
      guests[guestIndex].draftMessage = '';

      // ゲスト情報を更新
      setGuests([...guests]);
    }
  };

  return (
    <div>
      <h2>メッセージボックス</h2>
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

      {selectedMessage && (
        <div>
          <h3>依頼内容</h3>
          <p>{selectedMessage.message}</p>
          <button onClick={() => handleStartChat(selectedMessage.id)}>ガイドする</button>
        </div>
      )}

      {/* ゲストごとのチャットメッセージを表示 */}
      {guests.map((guest) => (
        <div key={guest.id}>
          {guest.chat.map((chat, index) => (
            <div key={index} className="guest-chat">
              <strong>{chat.sender}:</strong> {chat.message}
            </div>
          ))}

          {/* チャットテキストエリアと送信ボタン */}
          <textarea
            rows="4"
            cols="50"
            value={guest.draftMessage || ''}
            onChange={(e) => handleChatInputChange(e, guest.id)}
          ></textarea>
          <button onClick={() => sendChatMessage(guest.id)}>送信</button>
        </div>
      ))}
    </div>
  );
}

export default GuideMessageBox;
