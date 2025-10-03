import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { MOCK } from '../constants/index';
import { useWebSocketContext } from '../contexts/WebSocketContext';
import { authService } from '../services/authService';
import { useLanguage } from '../contexts/LanguageContext';
import type { SupportedLanguage } from '../contexts/LanguageContext';
import { useTranslations } from '../contexts/useTranslations';

const VerifyPage: React.FC = () => {
  const navigate = useNavigate();
  const { connect: connectWebSocket } = useWebSocketContext();
  const { language, setLanguage } = useLanguage();
  const [searchParams] = useSearchParams();
  const texts = useTranslations();

  const [roomName, setRoomName] = useState<string | null>(null);
  const [roomId, setRoomId] = useState<string | null>(null);
  
  const [guestName, setGuestName] = useState('');
  const [phoneSuffix, setPhoneSuffix] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setRoomName(searchParams.get('name'));
    setRoomId(searchParams.get('id'));
  }, [searchParams]);

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMessage('');

    if (!guestName || !phoneSuffix) {
      setErrorMessage(texts.verifyInvalidInput);
      setLoading(false);
      return;
    }

    try {
      const response = await authService.login(guestName, phoneSuffix, roomName || MOCK.roomNumber);

      if (response && response.id && response.chatwootConversationId) {
        console.log('验证成功，准备跳转到 /chat');
        
        try {
          const contactId = authService.getCurrentChatwootContactId();
          if (contactId) {
            console.log('使用contactId建立WebSocket连接:', contactId);
            await connectWebSocket(contactId);
            console.log('WebSocket连接已建立');
          } else {
            console.error('无法获取contactId，WebSocket连接失败');
          }
        } catch (error) {
          console.error('WebSocket连接失败:', error);
        }
        
        navigate(`/chat?conversationId=${response.chatwootConversationId}`);
      } else {
        // 失败 - 显示错误
        setErrorMessage(texts.verifyFailed_Verify);
        setGuestName('');
        setPhoneSuffix('');
      }
    } catch (error) {
      setErrorMessage(texts.networkError_Verify);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="bg-white rounded-lg shadow-lg p-8 w-full">
        {/* 语言选择 */}
        <div className="flex justify-end mb-4">
          <select 
            value={language} 
            onChange={(e) => setLanguage(e.target.value as SupportedLanguage)}
            className="px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            data-testid="language-select"
          >
            <option value="zh">中文</option>
            <option value="en">English</option>
            <option value="ja">日本語</option>
          </select>
        </div>

        {/* Logo和房号 */}
        <div className="text-center mb-8">
          <div className="w-20 h-20 bg-blue-600 rounded-full mx-auto mb-4 flex items-center justify-center">
            <i className="uil uil-building text-white text-3xl"></i>
          </div>
          <h1 className="text-2xl font-bold text-gray-800">{texts.welcome_Verify}</h1>
          <p className="text-gray-600 mt-2">{texts.roomNumber}{roomName || MOCK.roomNumber}</p>
        </div>

        {/* 验证表单 */}
        <form onSubmit={handleVerify} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {texts.guestNameLabel}
            </label>
            <input 
              type="text" 
              value={guestName}
              onChange={(e) => setGuestName(e.target.value)}
              data-testid="guest-name-input"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder={texts.guestNamePlaceholder}
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {texts.phoneSuffixLabel}
            </label>
            <input 
              type="text" 
              value={phoneSuffix}
              onChange={(e) => setPhoneSuffix(e.target.value)}
              data-testid="phone-suffix-input"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder={texts.phoneSuffixPlaceholder}
              required
              maxLength={4}
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
              <span>{texts.verifyButton_Verify}</span>
            )}
          </button>
        </form>

        {/* 帮助信息 */}
        <div className="mt-6 text-center">
          <p className="text-sm text-gray-500">{texts.helpText_Verify}</p>
          <a href="tel:021-12345678" className="text-blue-600 hover:underline">021-12345678</a>
        </div>
      </div>
    </div>
  );
};

export default VerifyPage; 