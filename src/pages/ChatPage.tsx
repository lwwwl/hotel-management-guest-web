import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import type { NotificationMessage, QuickMenuItem } from '../types';
import Message from '../components/Message';
import ChatInput from '../components/ChatInput';
import ErrorMessage from '../components/ErrorMessage';
import LoadingSpinner from '../components/LoadingSpinner';
import { useMessages } from '../hooks/useMessages';
import { useWebSocketContext } from '../contexts/WebSocketContext';
import { authService } from '../services/authService';
import { useLanguage } from '../contexts/LanguageContext';
import { getQuickMenuList } from '../services/quickMenuService';
import QuickMenuPanel from '../components/QuickMenuPanel';
import LanguageSelector from '../components/LanguageSelector';


const ChatPage: React.FC = () => {
  const navigate = useNavigate();
  const { isConnected: wsConnected, connectionError: wsError, registerMessageHandler } = useWebSocketContext();
  const { language } = useLanguage();
  const [inputText, setInputText] = useState('');
  const [showQuickMenu, setShowQuickMenu] = useState(false);
  const [quickMenuItems, setQuickMenuItems] = useState<QuickMenuItem[]>([]);
  const messageContainerRef = useRef<HTMLDivElement>(null);
  const quickMenuContainerRef = useRef<HTMLDivElement>(null);
  const [prevScrollHeight, setPrevScrollHeight] = useState<number | null>(null);
  
  const {
    messages,
    loading,
    loadingMore,
    hasMore,
    sending,
    error,
    sendMessage,
    addMessage,
    updateMessage,
    clearError,
    loadMoreMessages,
    // Translation props
    translateEnabled,
    translationLoading,
    toggleTranslate,
  } = useMessages(language);

  // 初次加载和新消息时滚动到底部
  useEffect(() => {
    if (loading) return; // 初始加载时等待数据
    const container = messageContainerRef.current;
    if (container) {
        // Simple heuristic: if we are near the bottom, scroll to the bottom.
        // This allows the user to scroll up and not be forced down.
        const isNearBottom = container.scrollHeight - container.scrollTop - container.clientHeight < 200;
        if (isNearBottom) {
            container.scrollTop = container.scrollHeight;
        }
    }
  }, [messages, loading]);

  // 分页加载时保持滚动位置
  useEffect(() => {
    if (!loadingMore && prevScrollHeight !== null && messageContainerRef.current) {
      const currentScrollHeight = messageContainerRef.current.scrollHeight;
      messageContainerRef.current.scrollTop = currentScrollHeight - prevScrollHeight;
      setPrevScrollHeight(null);
    }
  }, [loadingMore, prevScrollHeight]);

  const handleScroll = useCallback(() => {
    if (messageContainerRef.current && messageContainerRef.current.scrollTop < 100) {
      if (hasMore && !loadingMore && !loading) {
        if (messageContainerRef.current) {
          setPrevScrollHeight(messageContainerRef.current.scrollHeight);
        }
        loadMoreMessages();
      }
    }
  }, [hasMore, loadingMore, loading, loadMoreMessages]);

  useEffect(() => {
    const container = messageContainerRef.current;
    if (container) {
      container.addEventListener('scroll', handleScroll);
    }
    return () => {
      if (container) {
        container.removeEventListener('scroll', handleScroll);
      }
    };
  }, [handleScroll]);

  // 点击工具栏外部时，关闭工具栏
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (quickMenuContainerRef.current && !quickMenuContainerRef.current.contains(event.target as Node)) {
        setShowQuickMenu(false);
      }
    };

    if (showQuickMenu) {
      // 监听mousedown而不是click，可以更早地捕捉到事件
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showQuickMenu]);

  useEffect(() => {
    // 获取快捷菜单数据
    const fetchQuickMenu = async () => {
      try {
        const items = await getQuickMenuList();
        setQuickMenuItems(items);
      } catch (error) {
        console.error("Failed to fetch quick menu items:", error);
        // 可以在这里设置一个错误状态来通知用户
      }
    };

    fetchQuickMenu();
  }, []);

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

  const handleSendMessage = async () => {
    if (!inputText.trim() || sending) return;

    const content = inputText.trim();
    setShowQuickMenu(false); // 发送消息时关闭快捷菜单
    
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
              <h1 className="font-semibold">房间 {authService.getCurrentRoomNumber() || 'N/A'}</h1>
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
          <div className="flex items-center gap-4">
            <LanguageSelector />
            <button onClick={endChat} className="text-white hover:text-gray-200 transition-colors" title="结束对话">
              <i className="uil uil-sign-out-alt text-2xl"></i>
            </button>
          </div>
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
          ) : (
            <>
              {hasMore && (
                <div className="text-center py-2 text-gray-500 text-sm">
                  {loadingMore ? '加载中...' : '上拉加载更多'}
                </div>
              )}
              {messages.length === 0 && !loading && (
                <div className="flex justify-center items-center h-20">
                  <div className="text-gray-500">暂无消息</div>
                </div>
              )}
              {messages.map((message) => (
                  <Message key={message.id} message={message} />
              ))}
            </>
          )}
        </div>

        <div className="relative" ref={quickMenuContainerRef}>
          {showQuickMenu && (
              <QuickMenuPanel
                  items={quickMenuItems}
                  language={language}
                  onSelectItem={(message) => {
                      setInputText(message);
                      setShowQuickMenu(false);
                  }}
                  onClose={() => setShowQuickMenu(false)}
                  translateEnabled={translateEnabled}
                  onToggleTranslate={toggleTranslate}
                  translationLoading={translationLoading}
              />
          )}
          <ChatInput
            inputText={inputText}
            onInputChange={setInputText}
            onSendMessage={handleSendMessage}
            onToggleQuickMenu={() => setShowQuickMenu(!showQuickMenu)}
            disabled={sending}
          />
        </div>
      </div>
    </div>
  );
};

export default ChatPage; 