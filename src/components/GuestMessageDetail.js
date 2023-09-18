import React, { useState } from 'react';

function GuestMessageDetail({ message }) {
  const [replyMessage, setReplyMessage] = useState('');
  const [replyMessages, setReplyMessages] = useState({});

  const handleReplyChange = (e) => {
    setReplyMessage(e.target.value);
  };

  const handleSendReply = () => {
    if (replyMessage.trim() === '') {
      return;
    }

    const newReply = {
      sender: 'You',
      message: replyMessage,
    };

    setReplyMessages({
      ...replyMessages,
      [message.id]: [...(replyMessages[message.id] || []), newReply],
    });
    setReplyMessage('');
  };

  return (
    <div>
      <h3>{message.sender}'s 依頼内容</h3>
      <p>{message.message}</p>

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

export default GuestMessageDetail;
