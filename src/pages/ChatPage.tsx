import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { MOCK_MENU, MOCK } from '../constants';
import type { MenuItem } from '../types';
import Message from '../components/Message';
import ChatInput from '../components/ChatInput';
import ErrorMessage from '../components/ErrorMessage';
import LoadingSpinner from '../components/LoadingSpinner';
import { useMessages } from '../hooks/useMessages';

const ChatPage: React.FC = () => {
  const navigate = useNavigate();
  const [inputText, setInputText] = useState('');
  const [showMenu, setShowMenu] = useState(false);
  const messageContainerRef = useRef<HTMLDivElement>(null);
  
  const {
    messages,
    loading,
    sending,
    error,
    sendMessage,
    clearError
  } = useMessages();

  const scrollToBottom = () => {
    if (messageContainerRef.current) {
      messageContainerRef.current.scrollTop = messageContainerRef.current.scrollHeight;
    }
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const toggleMenu = () => {
    setShowMenu(!showMenu);
  };

  const selectMenuItem = (item: MenuItem) => {
    setInputText(item.template);
    setShowMenu(false);
  };

  const handleSendMessage = async () => {
    if (!inputText.trim() || sending) return;

    const content = inputText.trim();
    
    try {
      await sendMessage(content);
      setInputText('');

      // 检查是否需要二次验证（金额大于500）
      if (content.includes('点餐') && /\d{3,}/.test(content)) {
        console.log('触发高金额验证，跳转到 /verify-premium');
        setTimeout(() => {
          navigate('/verify-premium');
        }, 1000);
        return;
      }
    } catch (error) {
      // 错误已在hook中处理
      console.error('Send message error:', error);
    }
  };

  const endChat = () => {
    if (confirm('确定要结束对话吗？')) {
      console.log('结束对话，跳转到 /expired');
      localStorage.removeItem('guest_sid');
      navigate('/expired');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 bg-gray-50">
      <div className="bg-white rounded-lg shadow-lg w-full max-w-md flex flex-col h-[92vh]">
        {/* Header */}
        <header className="bg-blue-600 text-white p-4 flex items-center justify-between rounded-t-lg">
          <div className="flex items-center">
            <i className="uil uil-building mr-2 text-xl"></i>
            <div>
              <h1 className="font-semibold">房间 {MOCK.roomNumber}</h1>
              <p className="text-xs opacity-90">
                <i className="uil uil-check-circle"></i> 已验证
              </p>
            </div>
          </div>
          <button 
            onClick={endChat}
            data-testid="end-chat"
            className="text-white hover:bg-blue-700 p-2 rounded"
          >
            <i className="uil uil-times text-xl"></i>
          </button>
        </header>

        {/* 错误提示 */}
        {error && (
          <ErrorMessage message={error} onClose={clearError} />
        )}

        {/* 消息流区域 */}
        <div 
          ref={messageContainerRef}
          className="flex-1 overflow-y-auto p-4 space-y-4 scrollbar-hide"
          id="messageContainer"
        >
          {loading ? (
            <LoadingSpinner text="加载消息中..." />
          ) : messages.length === 0 ? (
            <div className="flex justify-center items-center h-20">
              <div className="text-gray-500">暂无消息</div>
            </div>
          ) : (
            messages.map((message) => (
              <Message key={message.id} message={message} />
            ))
          )}
        </div>

        <ChatInput
          inputText={inputText}
          onInputChange={setInputText}
          onSendMessage={handleSendMessage}
          onToggleMenu={toggleMenu}
          showMenu={showMenu}
          menuItems={MOCK_MENU}
          onSelectMenuItem={selectMenuItem}
          disabled={sending}
        />
      </div>
    </div>
  );
};

export default ChatPage; 