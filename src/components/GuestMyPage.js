// src/components/GuestMypage.js
import React from 'react';

function GuestMypage() {
  return (
    <div>
      <h2>ゲストマイページ</h2>
      {/* ゲストマイページのコンテンツをここに追加 */}
      <p>ここにゲストマイページの内容を表示します。</p>
      {/* 編集画面へのリンク */}
      <a href="/guest/mypage/edit">編集</a>
    </div>
  );
}

export default GuestMypage;