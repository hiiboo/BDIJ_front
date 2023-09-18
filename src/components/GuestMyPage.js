// src/components/GuestMyPage.js
import React from 'react';
import { Link } from 'react-router-dom'; // リンク用のコンポーネントをインポート

function GuestMyPage() {
  return (
    <div>
      <h2>ゲストマイページ</h2>
      {/* ゲストマイページのコンテンツをここに追加 */}
      <p>ここにゲストのマイページの内容を表示します。</p>
      {/* 編集画面へのリンク */}
      <Link to="/guest/edit">編集</Link> {/* Link コンポーネントを使用 */}
      {/* メッセージへのリンク */}
      <Link to="/guest/message">メッセージ</Link> {/* メッセージへのリンクを追加 */}
    </div>
  );
}

export default GuestMyPage;
