import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import VerifyPage from './pages/VerifyPage';
import ChatPage from './pages/ChatPage';
import ExpiredPage from './pages/ExpiredPage';
import VerifyPremiumPage from './pages/VerifyPremiumPage';
import { WebSocketProvider } from './contexts/WebSocketContext';
import { LanguageProvider } from './contexts/LanguageContext';
import './App.css';

function App() {
  return (
    <LanguageProvider>
      <WebSocketProvider>
        <Router>
          <div className="App">
            <Routes>
              <Route path="/" element={<VerifyPage />} />
              <Route path="/verify" element={<VerifyPage />} />
              <Route path="/chat" element={<ChatPage />} />
              <Route path="/expired" element={<ExpiredPage />} />
              <Route path="/verify-premium" element={<VerifyPremiumPage />} />
            </Routes>
          </div>
        </Router>
      </WebSocketProvider>
    </LanguageProvider>
  );
}

export default App;
