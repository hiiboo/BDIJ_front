// src/components/GuideProfile.js
import React from 'react';

function GuideProfile({ guide }) {
  return (
    <div>
      <h2>ガイドのプロフィール</h2>
      <img src={guide.photoUrl} alt="ガイドの写真" /> {/* 写真 */}
      <p>名前: {guide.name}</p>
      <p>性別: {guide.gender}</p> {/* 性別 */}
      <p>年齢: {guide.age}</p> {/* 年齢 */}
      <p>職業: {guide.occupation}</p> {/* 職業 */}
      <p>自己紹介: {guide.bio}</p> {/* 自己紹介文 */}
      <p>英語レベル: {guide.englishLevel}</p>
      <p>時給: {guide.hourlyRate}</p>
      <p>評価: {guide.rating}</p>
      {/* その他のガイドの詳細情報を表示 */}
      <button>依頼する</button>
    </div>
  );
}

export default GuideProfile;