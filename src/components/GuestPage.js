import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import GuideProfileCard from './GuideProfileCard';
import GuideProfile from './GuideProfile'; // 新しいコンポーネントをインポート

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
  const [selectedGuide, setSelectedGuide] = useState(null);
  const [showRequestForm, setShowRequestForm] = useState(false); // リクエストフォームを表示するための状態

  const handleRequestClick = () => {
    // ここでリクエストの送信処理などを実行する
    // 仮に成功した場合、会員登録ページに遷移
    // この部分は実際のバックエンドとの通信やデータ処理に依存します
    // 成功時には適切な画面に遷移する
    navigate('/guest/register');
  };

  const handleGuideCardClick = (guide) => {
    setSelectedGuide(guide);
    setShowRequestForm(true); // ガイドの詳細情報を表示すると同時にリクエストフォームを表示
  };

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
      <h3>利用可能なガイド</h3>
      <div className="guide-cards-container">
        {guidesData.map((guide) => (
          <div key={guide.id} onClick={() => handleGuideCardClick(guide)}>
            <GuideProfileCard guideData={guide} />
          </div>
        ))}
      </div>

      {selectedGuide && (
        <div>
          <h3>ガイドの詳細情報</h3>
          <GuideProfile guide={selectedGuide} />
          
          {showRequestForm && (
            <div>
              <h3>観光情報入力</h3>
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
            <label>ガイドの金額</label>
            <input
              type="number"
              value={hourlyRate}
              onChange={(e) => setHourlyRate(e.target.value)}
            />
            × 時間    
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
            </div>
          )}
          <button onClick={handleRequestClick}>Request</button>
        </div>
      )}
    </div>
  );
}

export default GuestPage;