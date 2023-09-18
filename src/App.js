// src/components/App.js
import React from 'react';
import { BrowserRouter as Router, Link, Route, Routes } from 'react-router-dom';
import './App.css';
import Home from './components/Home'; // ホームページコンポーネント
import GuidePage from './components/GuidePage'; // ガイドページコンポーネント
import GuideProfile from './components/GuideProfile'; // ガイドプロフィールコンポーネント
import GuideMyPage from './components/GuideMyPage'; // ガイドマイページコンポーネント
import GuideMessageBox from './components/GuideMessageBox'; // ガイドマイページコンポーネント

import GuestPage from './components/GuestPage'; // ゲストページコンポーネント
import GuestRegister from './components/GuestRegister'; // ゲストレジスターコンポーネント
import GuestMyPage from './components/GuestMyPage'; // GuestMyPageをインポート
import GuestMessageBox from './components/GuestMessageBox'; // GuestMessageBoxコンポーネントをインポート

function App() {
  return (
    <Router>
      <div className="App">
        <img src="/logo.png" alt="Logo" className="logo" />
        <h1>
          <Link to="/guest">Guest</Link>
        </h1>
        <h2>
          <Link to="/guide">現地人ガイド</Link>
        </h2>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/guide" element={<GuidePage />} />
          <Route path="/guide/profile/:id" element={<GuideProfile />} />
          <Route path="/guide/mypage" element={<GuideMyPage />} />
          <Route path="/guide/message" element={<GuideMessageBox />} />

          <Route path="/guest" element={<GuestPage />} />
          <Route path="/guest/register" element={<GuestRegister />} />
          <Route path="/guest/mypage" element={<GuestMyPage />} />
          <Route path="/guest/message" element={<GuestMessageBox />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;