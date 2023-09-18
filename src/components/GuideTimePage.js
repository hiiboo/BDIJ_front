import React, { useState, useEffect } from 'react';

function GuideTimePage() {
  const [timer, setTimer] = useState(0);
  const [salary, setSalary] = useState(0);
  const [isStopped, setIsStopped] = useState(false);
  const [rating, setRating] = useState(0);
  const [isRatingSubmitted, setIsRatingSubmitted] = useState(false);
  const [review, setReview] = useState('');

  useEffect(() => {
    let interval;
    if (!isStopped) {
      interval = setInterval(() => {
        setTimer((prevTimer) => prevTimer + 1);
        setSalary((prevSalary) => prevSalary + 10); // 給料を増やす例
      }, 1000);
    }

    return () => {
      clearInterval(interval);
    };
  }, [isStopped]);

  const handleStop = () => {
    setIsStopped(true);
  };

  const handleRatingChange = (event) => {
    setRating(parseInt(event.target.value, 10));
  };

  const handleReviewChange = (event) => {
    setReview(event.target.value);
  };

  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    const formattedTime = `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
    return formattedTime;
  };

  const handleSubmitRating = () => {
    // レビューの送信ロジックをここに実装する
    setIsRatingSubmitted(true);
  };

  return (
    <div>
      <h2>ガイド中のページ</h2>
      <p>ガイドの時間: {formatTime(timer)}</p>
      <p>給料: {salary}円</p>
      
      {!isRatingSubmitted ? (
        <>
          {timer >= 60 ? (
            <>
              <button onClick={handleStop}>終了</button>
              <h3>評価</h3>
              <label>
                星の評価：
                <select value={rating} onChange={handleRatingChange}>
                  <option value={1}>1星</option>
                  <option value={2}>2星</option>
                  <option value={3}>3星</option>
                  <option value={4}>4星</option>
                  <option value={5}>5星</option>
                </select>
              </label>
              <h3>レビュー</h3>
              <textarea rows="4" cols="50" value={review} onChange={handleReviewChange}></textarea>
              <button onClick={handleSubmitRating}>評価とレビューを送信</button>
            </>
          ) : (
            <p>1分以上経過すると評価とレビューが入力できます。</p>
          )}
        </>
      ) : (
        <p>評価とレビューが送信されました。ありがとうございました！</p>
      )}
    </div>
  );
}

export default GuideTimePage;
