// src/components/GuideProfile.js
import React from 'react';

function GuideProfile({ guide }) {
  return (
    <div>
      <h2>ガイドのプロフィール</h2>
      <p>名前: {guide.name}</p>
      <p>英語レベル: {guide.englishLevel}</p>
      <p>時給: {guide.hourlyRate}</p>
      <p>評価: {guide.rating}</p>
      {/* その他のガイドの詳細情報を表示 */}
      <button>依頼する</button>
    </div>
  );
}

export default GuideProfile;