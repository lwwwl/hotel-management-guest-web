import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const VerifyPremiumPage: React.FC = () => {
  const navigate = useNavigate();
  const [verifyCode, setVerifyCode] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMessage('');

    try {
      // 模拟API调用
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      if (verifyCode === '123456') {
        // 成功 - 跳转回聊天页面
        console.log('高级验证成功，返回聊天页面');
        alert('验证成功！');
        navigate('/chat');
      } else {
        // 失败 - 显示错误
        setErrorMessage('验证失败，请检查输入信息是否正确');
        setVerifyCode('');
      }
    } catch (error) {
      setErrorMessage('网络错误，请稍后重试');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 bg-gray-50">
      <div className="bg-white rounded-lg shadow-lg p-8 w-full max-w-md">
        <div className="text-center mb-8">
          <div className="w-20 h-20 bg-orange-500 rounded-full mx-auto mb-4 flex items-center justify-center">
            <i className="uil uil-shield-check text-white text-3xl"></i>
          </div>
          <h1 className="text-2xl font-bold text-gray-800">高级验证</h1>
          <p className="text-gray-600 mt-2">
            由于您的订单金额较高，需要进行额外验证
          </p>
        </div>

        <form onSubmit={handleVerify} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              请输入6位验证码
            </label>
            <input 
              type="text" 
              value={verifyCode}
              onChange={(e) => setVerifyCode(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="请输入6位数字验证码"
              maxLength={6}
              required
            />
          </div>

          {errorMessage && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-3">
              <p className="text-red-600 text-sm">{errorMessage}</p>
            </div>
          )}

          <button 
            type="submit"
            disabled={loading}
            className="w-full py-3 px-4 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {loading ? (
              <span className="flex items-center justify-center">
                <i className="uil uil-spinner-alt animate-spin mr-2"></i>
                <span>验证中...</span>
              </span>
            ) : (
              <span>确认验证</span>
            )}
          </button>
        </form>

        <div className="mt-6 text-center">
          <p className="text-sm text-gray-500">
            验证码已发送至您的手机，请注意查收
          </p>
        </div>
      </div>
    </div>
  );
};

export default VerifyPremiumPage; 