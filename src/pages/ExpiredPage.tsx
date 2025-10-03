import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslations } from '../contexts/useTranslations';

const ExpiredPage: React.FC = () => {
  const navigate = useNavigate();
  const texts = useTranslations();

  const handleRestart = () => {
    navigate('/verify');
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 bg-gray-50">
      <div className="bg-white rounded-lg shadow-lg p-8 w-full max-w-md text-center">
        <div className="w-20 h-20 bg-red-500 rounded-full mx-auto mb-4 flex items-center justify-center">
          <i className="uil uil-clock text-white text-3xl"></i>
        </div>
        <h1 className="text-2xl font-bold text-gray-800 mb-4">{texts.sessionExpiredTitle}</h1>
        <p className="text-gray-600 mb-6">
          {texts.sessionExpiredMessage}
        </p>
      </div>
    </div>
  );
};

export default ExpiredPage; 