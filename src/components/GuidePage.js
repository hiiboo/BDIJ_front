import React from 'react';
import AuthForm from './AuthForm'; // AuthFormコンポーネントをインポート
import { Link } from 'react-router-dom';

function GuidePage() {
  return (
    <div>
      <AuthForm /> {/* AuthFormコンポーネントを表示 */}
      <Link to="/guide/mypage">ガイドマイページへ</Link> {/* ガイドマイページへのリンク */}
    </div>
  );
}

export default GuidePage;