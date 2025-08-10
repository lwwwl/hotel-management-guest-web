import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { LANGUAGES, MOCK, getQuickServices } from '../constants';
import type { QuickService } from '../types';
import ServiceModal from '../components/ServiceModal';
import QuickServices from '../components/QuickServices';
import { useWebSocketContext } from '../contexts/WebSocketContext';
import { authService } from '../services/authService';

const VerifyPage: React.FC = () => {
  const navigate = useNavigate();
  const { connect: connectWebSocket } = useWebSocketContext();
  const [currentLanguage, setCurrentLanguage] = useState('zh');
  const [verifyCode, setVerifyCode] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [showServiceModal, setShowServiceModal] = useState(false);
  const [selectedService, setSelectedService] = useState<QuickService | null>(null);
  const [serviceNote, setServiceNote] = useState('');

  const texts = LANGUAGES[currentLanguage] || LANGUAGES.zh;
  const quickServices = getQuickServices(currentLanguage);

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMessage('');

    try {
      // 使用认证服务进行验证
      const isValid = await authService.mockLogin(verifyCode, MOCK.roomNumber);
      
      if (isValid) {
        console.log('验证成功，准备跳转到 /chat');
        
        // 从认证服务获取guestId，建立WebSocket连接
        try {
          const guestId = authService.getCurrentGuestId();
          console.log('使用guestId建立WebSocket连接:', guestId);
          await connectWebSocket(guestId);
          console.log('WebSocket连接已建立');
        } catch (error) {
          console.error('WebSocket连接失败:', error);
          // 即使WebSocket连接失败，也允许用户进入聊天页面
        }
        
        alert(texts.verifySuccess);
        navigate('/chat');
      } else {
        // 失败 - 显示错误
        setErrorMessage(texts.verifyFailed);
        setVerifyCode('');
      }
    } catch (error) {
      setErrorMessage(texts.networkError);
    } finally {
      setLoading(false);
    }
  };

  const requestService = (service: QuickService) => {
    setSelectedService(service);
    setShowServiceModal(true);
    console.log('请求服务:', service.name);
  };

  const confirmService = () => {
    if (!selectedService) return;
    
    console.log('确认服务请求:', {
      service: selectedService.name,
      room: MOCK.roomNumber,
      note: serviceNote,
      language: currentLanguage
    });
    
    // 模拟API调用
    setTimeout(() => {
      alert(texts.serviceConfirmed);
      setShowServiceModal(false);
      setSelectedService(null);
      setServiceNote('');
    }, 500);
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 bg-gray-50">
      <div className="bg-white rounded-lg shadow-lg p-8 w-full max-w-md">
        {/* 语言选择 */}
        <div className="flex justify-end mb-4">
          <select 
            value={currentLanguage} 
            onChange={(e) => setCurrentLanguage(e.target.value)}
            className="px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            data-testid="language-select"
          >
            <option value="zh">中文</option>
            <option value="en">English</option>
            <option value="ja">日本語</option>
            <option value="ko">한국어</option>
          </select>
        </div>

        {/* Logo和房号 */}
        <div className="text-center mb-8">
          <div className="w-20 h-20 bg-blue-600 rounded-full mx-auto mb-4 flex items-center justify-center">
            <i className="uil uil-building text-white text-3xl"></i>
          </div>
          <h1 className="text-2xl font-bold text-gray-800">{texts.welcome}</h1>
          <p className="text-gray-600 mt-2">{texts.roomNumber}{MOCK.roomNumber}</p>
        </div>

        {/* 验证表单 */}
        <form onSubmit={handleVerify} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {texts.verifyLabel}
            </label>
            <input 
              type="text" 
              value={verifyCode}
              onChange={(e) => setVerifyCode(e.target.value)}
              data-testid="verify-input"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder={texts.verifyPlaceholder}
              required
            />
          </div>

          {/* 错误提示 */}
          {errorMessage && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-3">
              <p className="text-red-600 text-sm">{errorMessage}</p>
            </div>
          )}

          {/* 确认按钮 */}
          <button 
            type="submit"
            data-testid="verify-submit"
            disabled={loading}
            className="w-full py-3 px-4 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {loading ? (
              <span className="flex items-center justify-center">
                <i className="uil uil-spinner-alt animate-spin mr-2"></i>
                <span>{texts.verifying}</span>
              </span>
            ) : (
              <span>{texts.verifyButton}</span>
            )}
          </button>
        </form>

        {/* 快捷服务菜单 */}
        <div className="mt-8 border-t pt-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">{texts.quickServices}</h3>
          <QuickServices services={quickServices} onServiceClick={requestService} />
          <p className="text-xs text-gray-500 mt-3 text-center">{texts.serviceNote}</p>
        </div>

        {/* 帮助信息 */}
        <div className="mt-6 text-center">
          <p className="text-sm text-gray-500">{texts.helpText}</p>
          <a href="tel:021-12345678" className="text-blue-600 hover:underline">021-12345678</a>
        </div>
      </div>

      {/* 服务请求模态框 */}
      <ServiceModal
        isOpen={showServiceModal}
        selectedService={selectedService}
        serviceNote={serviceNote}
        onServiceNoteChange={setServiceNote}
        onConfirm={confirmService}
        onCancel={() => {
          setShowServiceModal(false);
          setSelectedService(null);
          setServiceNote('');
        }}
        texts={texts}
      />
    </div>
  );
};

export default VerifyPage; 