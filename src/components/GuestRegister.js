// src/components/GuestRegister.js
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

function GuestRegister() {
  const navigate = useNavigate();

  const [photo, setPhoto] = useState('');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleRegister = async () => {
    try {
      // ここで会員登録の処理を実行し、成功したらゲストマイページに遷移する
      // 例: バックエンドとの通信を行い、ユーザーを登録
      // 登録が成功した場合に、ゲストマイページに遷移する
      // 以下は仮の成功時の処理
      // 登録成功時には、実際のユーザー情報やトークンを取得することが一般的です
      // ここではsetTimeoutを使用して1秒後に遷移する例を示しています
      await new Promise((resolve) => setTimeout(resolve, 1000));
      navigate('/guest/mypage'); // ゲストマイページへの遷移
    } catch (error) {
      // エラーハンドリング（登録が失敗した場合の処理）
      console.error('登録エラー:', error);
      // エラーメッセージを表示するか、必要に応じて処理を追加
    }
  };

  return (
    <div>
      <h3>会員登録</h3>
      <h3>SNS認証</h3>
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