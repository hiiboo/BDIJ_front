// src/components/GuideProfile.js
import React from 'react';
import { useParams } from 'react-router-dom';

function GuideProfile() {
  const { id } = useParams();

  // ここでガイドIDを使用してガイドの詳細情報を取得するためのコードを追加できます

  return (
    <div>
      {/* ガイドの詳細情報を表示 */}
      <h2>ガイドのプロフィール</h2>
      {/* ガイドの詳細情報を表示するコードを追加 */}
      <button>依頼する</button>
    </div>
  );
}

export default GuideProfile;