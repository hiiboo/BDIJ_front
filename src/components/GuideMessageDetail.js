import React, { useState } from 'react';

function GuideMessageDetail({ message }) {
  const [replyMessage, setReplyMessage] = useState('');
  const [replyMessages, setReplyMessages] = useState({}); // 返信メッセージの一覧をオブジェクトとして管理

  const handleReplyChange = (e) => {
    setReplyMessage(e.target.value);
  };

  const handleSendReply = () => {
    if (replyMessage.trim() === '') {
      return; // 空の返信は送信しない
    }

    // メッセージごとに返信を格納
    const newReply = {
      sender: 'You', // ユーザー自身が送信した返信
      message: replyMessage,
    };

    setReplyMessages({
      ...replyMessages,
      [message.id]: [...(replyMessages[message.id] || []), newReply], // メッセージIDごとに格納
    });
    setReplyMessage(''); // 入力フィールドをクリア
  };

  return (
    <div>
      <h3>{message.sender}'s 依頼内容</h3>
      <p>{message.message}</p>

      {/* メッセージごとに返信メッセージの一覧を表示 */}
      {replyMessages[message.id] &&
        replyMessages[message.id].map((reply, index) => (
          <div key={index} className="reply-message">
            <strong>{reply.sender}:</strong> {reply.message}
          </div>
        ))}

      <div>
        <h4>返信</h4>
        <textarea
          rows="4"
          cols="50"
          value={replyMessage}
          onChange={handleReplyChange}
        ></textarea>
        <br />
        <button onClick={handleSendReply}>返信する</button>
      </div>
    </div>
  );
}

export default GuideMessageDetail;