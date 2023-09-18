// src/components/GuideProfileCard.js
import React from 'react';

function GuideProfileCard({ guideData }) {
  return (
    <div className="guide-card">
      <img src={guideData.photo} alt={guideData.name} />
      <h3>{guideData.name}</h3>
      <p>英語レベル: {guideData.englishLevel}</p>
      <p>時給: {guideData.hourlyRate}</p>
      <p>評価: {guideData.rating}</p>
    </div>
  );
}

export default GuideProfileCard;