import React from 'react';
import { useNavigate } from 'react-router-dom';

const ExpiredPage: React.FC = () => {
  const navigate = useNavigate();

  const handleRestart = () => {
    navigate('/verify');
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 bg-gray-50">
      <div className="bg-white rounded-lg shadow-lg p-8 w-full max-w-md text-center">
        <div className="w-20 h-20 bg-red-500 rounded-full mx-auto mb-4 flex items-center justify-center">
          <i className="uil uil-clock text-white text-3xl"></i>
        </div>
        <h1 className="text-2xl font-bold text-gray-800 mb-4">会话已过期</h1>
        <p className="text-gray-600 mb-6">
          您的会话已结束，如需继续使用服务，请重新验证身份。
        </p>
        <button 
          onClick={handleRestart}
          className="w-full py-3 px-4 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors"
        >
          重新开始
        </button>
      </div>
    </div>
  );
};

export default ExpiredPage; 