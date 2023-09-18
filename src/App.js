// src/components/App.js
import React from 'react';
import { BrowserRouter as Router, Link, Route, Routes } from 'react-router-dom';
import './App.css';
import Home from './components/Home'; // ホームページコンポーネント
import GuestPage from './components/GuestPage'; // ゲストページコンポーネント
import GuidePage from './components/GuidePage'; // ガイドページコンポーネント
import GuideProfile from './components/GuideProfile'; // ガイドプロフィールコンポーネントを追加

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
          <Route path="/guest" element={<GuestPage />} />
          <Route path="/guide/profile/:id" element={<GuideProfile />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;