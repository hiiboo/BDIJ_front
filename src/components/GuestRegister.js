// src/components/GuestRegister.js
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

function GuestRegister() {
  const navigate = useNavigate();

  const [photo, setPhoto] = useState('');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleRegister = () => {
    // ここで会員登録の処理を実行し、成功したら他の画面に遷移する
    // 例: バックエンドとの通信を行い、ユーザーを登録
    // 成功時には適切な画面に遷移する
    navigate('/guest'); // 仮の遷移先
  };

  return (
    <div>
      <h3>会員登録</h3>
      <div>
        <label>写真</label>
        <input
          type="file"
          accept="image/*"
          onChange={(e) => setPhoto(e.target.files[0])}
        />
      </div>
      <div>
        <label>名前</label>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
      </div>
      <div>
        <label>メールアドレス</label>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
      </div>
      <div>
        <label>パスワード</label>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
      </div>
      <button onClick={handleRegister}>登録</button>
      <Link to="/guest">戻る</Link>
    </div>
  );
}

export default GuestRegister;