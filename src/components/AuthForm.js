import React, { useState } from 'react';

function AuthForm() {
  // 新しいステートを追加
  const [displayName, setDisplayName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [age, setAge] = useState('');
  const [gender, setGender] = useState('');
  const [occupation, setOccupation] = useState('');
  const [profileImage, setProfileImage] = useState(null);
  const [shiftSchedule, setShiftSchedule] = useState('');
  const [languages, setLanguages] = useState([]);
  const [bio, setBio] = useState('');
  const [hourlyRate, setHourlyRate] = useState('');

  const handleDisplayNameChange = (e) => {
    setDisplayName(e.target.value);
  };

  const handleEmailChange = (e) => {
    setEmail(e.target.value);
  };

  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
  };

  const handleAgeChange = (e) => {
    setAge(e.target.value);
  };

  const handleGenderChange = (e) => {
    setGender(e.target.value);
  };

  const handleOccupationChange = (e) => {
    setOccupation(e.target.value);
  };

  const handleProfileImageChange = (e) => {
    // プロフィール画像のアップロードを処理するロジックを追加
  };

  const handleShiftScheduleChange = (e) => {
    setShiftSchedule(e.target.value);
  };

  const handleLanguagesChange = (e) => {
    // 使用できる言語とそのレベルを処理するロジックを追加
  };

  const handleBioChange = (e) => {
    setBio(e.target.value);
  };

  const handleHourlyRateChange = (e) => {
    setHourlyRate(e.target.value);
  };

  const handleSignUp = () => {
    // フォームの値をまとめてリクエストに含めて送信するロジックを実装
    const formData = {
      displayName,
      email,
      password,
      age,
      gender,
      occupation,
      profileImage,
      shiftSchedule,
      languages,
      bio,
      hourlyRate,
    };

    // サーバーにデータを送信するためのAPI呼び出しを行うか、適切な方法を選択
  };

  return (
    <div>
      <h2>会員登録</h2>
      <div>
        <label>表示名</label>
        <input type="text" placeholder="表示名" value={displayName} onChange={handleDisplayNameChange} />
      </div>
      <div>
        <label>メールアドレス</label>
        <input type="email" placeholder="メールアドレス" value={email} onChange={handleEmailChange} />
      </div>
      <div>
        <label>パスワード</label>
        <input type="password" placeholder="パスワード" value={password} onChange={handlePasswordChange} />
      </div>
    
      {/* 年齢 */}
      <div>
        <label>年齢</label>
        <input type="number" placeholder="年齢" value={age} onChange={handleAgeChange} />
      </div>
    
      {/* 性別 */}
      <div>
        <label>性別</label>
        <select value={gender} onChange={handleGenderChange}>
          <option value="male">男性</option>
          <option value="female">女性</option>
          <option value="other">その他</option>
        </select>
      </div>
    
      {/* 職業 */}
      <div>
        <label>職業</label>
        <input type="text" placeholder="職業" value={occupation} onChange={handleOccupationChange} />
      </div>
    
      {/* プロフィール画像 */}
      <div>
        <label>プロフィール画像</label>
        <input type="file" accept="image/*" onChange={handleProfileImageChange} />
      </div>
    
      {/* 1週間のシフトスケジュール */}
      <div>
        <label>1週間のシフトスケジュール</label>
        <textarea placeholder="1週間のシフトスケジュール" value={shiftSchedule} onChange={handleShiftScheduleChange}></textarea>
      </div>
    
      {/* 使用できる言語とそのレベル */}
      {/* 例: 星をタップできるレベルの選択を実装 */}
    
      {/* 自己紹介文 */}
      <div>
        <label>自己紹介文</label>
        <textarea placeholder="自己紹介文" value={bio} onChange={handleBioChange}></textarea>
      </div>
    
      {/* 時給 */}
      <div>
        <label>時給</label>
        <input type="number" placeholder="時給" value={hourlyRate} onChange={handleHourlyRateChange} />
      </div>
    
      {/* 記載欄 */}
      {/* 任意の追加情報を入力するためのフィールド */}
    
      <div>
        <button onClick={handleSignUp}>登録</button>
      </div>
    </div>
  );
}

export default AuthForm;
