import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import VerifyPage from './pages/VerifyPage';
import ChatPage from './pages/ChatPage';
import ExpiredPage from './pages/ExpiredPage';
import VerifyPremiumPage from './pages/VerifyPremiumPage';
import './App.css';

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/verify" element={<VerifyPage />} />
          <Route path="/chat" element={<ChatPage />} />
          <Route path="/expired" element={<ExpiredPage />} />
          <Route path="/verify-premium" element={<VerifyPremiumPage />} />
          <Route path="/" element={<Navigate to="/verify" replace />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
