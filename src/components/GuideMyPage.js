import React, { useState } from 'react';

function GuideMyPage() {
  // ガイドのプロフィール情報をステートとして保持
  const [guideProfile, setGuideProfile] = useState({
    name: 'John Doe', // ガイドの名前
    gender: '男性', // ガイドの性別
    age: 30, // ガイドの年齢
    hourlyRate: '3000円', // ガイドの時給
    occupation: 'ガイド', // ガイドの職業
    introduction:
      'こんにちは、私はJohn Doeです。観光ガイドをしています。楽しいツアーを提供します。', // ガイドの自己紹介文
  });

  // プロフィール情報を編集するフォームのステート
  const [editing, setEditing] = useState(false);

  // フォームで編集した情報を一時的に保持するステート
  const [editedProfile, setEditedProfile] = useState({ ...guideProfile });

  // 編集モードを切り替える関数
  const toggleEditing = () => {
    setEditing(!editing);
  };

  // プロフィール情報を保存する関数
  const saveProfile = () => {
    setGuideProfile({ ...editedProfile });
    toggleEditing(); // 編集モードを終了
  };

  // 編集中のフォームで情報を更新する関数
  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditedProfile({
      ...editedProfile,
      [name]: value,
    });
  };

  return (
    <div>
      <h2>ガイドマイページ</h2>
      <div>
        <label>名前</label>
        {editing ? (
          <input
            type="text"
            name="name"
            value={editedProfile.name}
            onChange={handleEditChange}
          />
        ) : (
          <span>{guideProfile.name}</span>
        )}
      </div>
      <div>
        <label>性別</label>
        {editing ? (
          <input
            type="text"
            name="gender"
            value={editedProfile.gender}
            onChange={handleEditChange}
          />
        ) : (
          <span>{guideProfile.gender}</span>
        )}
      </div>
      <div>
        <label>年齢</label>
        {editing ? (
          <input
            type="number"
            name="age"
            value={editedProfile.age}
            onChange={handleEditChange}
          />
        ) : (
          <span>{guideProfile.age} 歳</span>
        )}
      </div>
      <div>
        <label>時給</label>
        {editing ? (
          <input
            type="text"
            name="hourlyRate"
            value={editedProfile.hourlyRate}
            onChange={handleEditChange}
          />
        ) : (
          <span>{guideProfile.hourlyRate}</span>
        )}
      </div>
      <div>
        <label>職業</label>
        {editing ? (
          <input
            type="text"
            name="occupation"
            value={editedProfile.occupation}
            onChange={handleEditChange}
          />
        ) : (
          <span>{guideProfile.occupation}</span>
        )}
      </div>
      <div>
        <label>自己紹介文</label>
        {editing ? (
          <textarea
            name="introduction"
            value={editedProfile.introduction}
            onChange={handleEditChange}
          />
        ) : (
          <p>{guideProfile.introduction}</p>
        )}
      </div>
      <div>
        {editing ? (
          <button onClick={saveProfile}>保存</button>
        ) : (
          <button onClick={toggleEditing}>編集</button>
        )}
      </div>
    </div>
  );
}

export default GuideMyPage;
