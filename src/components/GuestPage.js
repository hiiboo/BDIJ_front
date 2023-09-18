// src/components/GuestPage.js
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import GuideProfileCard from './GuideProfileCard'; // 新しいコンポーネントをインポート

function GuestPage() {
  const navigate = useNavigate();
  const [meetingLocation, setMeetingLocation] = useState('');
  const [destination, setDestination] = useState('');
  const [startTime, setStartTime] = useState('');
  const [endTime, setEndTime] = useState('');
  const [guestCount, setGuestCount] = useState('');
  const [hourlyRate, setHourlyRate] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('');
  const [requestText, setRequestText] = useState('');
  const handleRequestClick = () => {
    // ここで会員登録画面に遷移する
    navigate('/guest/register');
  };

  // ガイドのプロフィール情報のダミーデータ（複数のガイドを持つ場合）
  const guidesData = [
    {
      id: 1,
      name: 'ガイド1',
      photo: '/guide1.jpg',
      englishLevel: '上級',
      hourlyRate: '3000円',
      rating: 4.5,
    },
    // 他のガイド情報も追加
  ];

  return (
    <div>
      {/* ガイドのプロフィールカードを表示 */}
      <h3>利用可能なガイド</h3>
      <div className="guide-cards-container">
        {guidesData.map((guide) => (
          <Link key={guide.id} to={`/guide/profile/${guide.id}`}>
            <GuideProfileCard guideData={guide} />
          </Link>
        ))}
      </div>

      <h3>観光情報入力</h3>
      <div>
        <label>待ち合わせ場所（Googleマップが表示される予定の場所）</label>
        <input
          type="text"
          value={meetingLocation}
          onChange={(e) => setMeetingLocation(e.target.value)}
        />
      </div>
      <div>
        <label>終着地点（Googleマップが表示される予定の場所）</label>
        <input
          type="text"
          value={destination}
          onChange={(e) => setDestination(e.target.value)}
        />
      </div>
      <div>
        <label>待ち合わせ時間</label>
        <input
          type="text"
          value={startTime}
          onChange={(e) => setStartTime(e.target.value)}
        />
      </div>
      <div>
        <label>終了時間</label>
        <input
          type="text"
          value={endTime}
          onChange={(e) => setEndTime(e.target.value)}
        />
      </div>
      <div>
        <label>ゲストの人数</label>
        <input
          type="number"
          value={guestCount}
          onChange={(e) => setGuestCount(e.target.value)}
        />
      </div>
      <div>
        <label>ガイドの時給</label>
        <input
          type="number"
          value={hourlyRate}
          onChange={(e) => setHourlyRate(e.target.value)}
        />
      </div>
      <div>
        <label>支払い方法</label>
        <input
          type="text"
          value={paymentMethod}
          onChange={(e) => setPaymentMethod(e.target.value)}
        />
      </div>
      <div>
        <label>ガイドへの依頼文</label>
        <textarea
          value={requestText}
          onChange={(e) => setRequestText(e.target.value)}
        />
      </div>

      <button onClick={handleRequestClick}>Request</button>

    </div>
  );
}

export default GuestPage;

