import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { MOCK_MENU, MOCK } from '../constants';
import type { MenuItem, NotificationMessage } from '../types';
import Message from '../components/Message';
import ChatInput from '../components/ChatInput';
import ErrorMessage from '../components/ErrorMessage';
import LoadingSpinner from '../components/LoadingSpinner';
import { useMessages } from '../hooks/useMessages';
import { useWebSocketContext } from '../contexts/WebSocketContext';
import { authService } from '../services/authService';

const ChatPage: React.FC = () => {
  const navigate = useNavigate();
  const { isConnected: wsConnected, connectionError: wsError, registerMessageHandler } = useWebSocketContext();
  const [inputText, setInputText] = useState('');
  const [showMenu, setShowMenu] = useState(false);
  const messageContainerRef = useRef<HTMLDivElement>(null);
  
  const {
    messages,
    loading,
    sending,
    error,
    sendMessage,
    addMessage,
    updateMessage,
    clearError
  } = useMessages();

  // 处理WebSocket消息
  const handleWebSocketMessage = useCallback((notification: NotificationMessage) => {
    console.log('ChatPage收到WebSocket消息:', notification);
    
    if (!notification.data) {
      console.warn('通知消息缺少data字段:', notification);
      return;
    }

    switch (notification.type) {
      case 'message_created':
        console.log('处理新消息:', notification.data);
        try {
          // 解析JSON字符串为Message对象
          const messageData = JSON.parse(notification.data);
          // 添加新消息到列表
          addMessage(messageData);
        } catch (error) {
          console.error('解析消息JSON失败:', error);
          console.error('原始数据:', notification.data);
        }
        break;
        
      case 'message_updated':
        console.log('处理消息更新:', notification.data);
        try {
          // 解析JSON字符串为Message对象
          const messageData = JSON.parse(notification.data);
          // 更新现有消息
          updateMessage(messageData);
        } catch (error) {
          console.error('解析消息JSON失败:', error);
        }
        break;
        
      default:
        console.log('忽略未知类型的通知:', notification.type);
    }
  }, [addMessage, updateMessage]);

  // 注册消息处理器
  useEffect(() => {
    const unregister = registerMessageHandler(handleWebSocketMessage);
    return unregister;
  }, [registerMessageHandler, handleWebSocketMessage]);

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
      // 清除认证服务的登录信息
      authService.clearLoginInfo();
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
              <h1 className="font-semibold">房间 {authService.getCurrentRoomNumber() || MOCK.roomNumber}</h1>
              <div className="flex items-center gap-2">
                <p className="text-xs opacity-90">
                  <i className="uil uil-check-circle"></i> 已验证
                </p>
                {/* WebSocket连接状态指示器 */}
                <div className={`w-2 h-2 rounded-full ${wsConnected ? 'bg-green-400' : 'bg-red-400'}`} 
                     title={wsConnected ? 'WebSocket已连接' : 'WebSocket未连接'} />
              </div>
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
        
        {/* WebSocket连接错误提示 */}
        {wsError && (
          <ErrorMessage message={`WebSocket连接错误: ${wsError}`} onClose={() => {}} />
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