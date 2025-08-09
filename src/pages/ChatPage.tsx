import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { MOCK_MENU, MOCK_MESSAGES, MOCK } from '../constants';
import type { Message as MessageType, MenuItem } from '../types';
import Message from '../components/Message';
import ChatInput from '../components/ChatInput';

const ChatPage: React.FC = () => {
  const navigate = useNavigate();
  const [messages, setMessages] = useState<MessageType[]>([...MOCK_MESSAGES]);
  const [inputText, setInputText] = useState('');
  const [showMenu, setShowMenu] = useState(false);
  const [messageId, setMessageId] = useState(3);
  const messageContainerRef = useRef<HTMLDivElement>(null);

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

  const sendMessage = async () => {
    if (!inputText.trim()) return;

    const text = inputText;
    const time = new Date().toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' });

    // 添加用户消息
    const newMessage: MessageType = {
      id: messageId,
      sender: 'guest',
      text: text,
      time: time
    };

    setMessages(prev => [...prev, newMessage]);
    setInputText('');
    setMessageId(prev => prev + 1);

    // 检查是否需要二次验证（金额大于500）
    if (text.includes('点餐') && /\d{3,}/.test(text)) {
      console.log('触发高金额验证，跳转到 /verify-premium');
      setTimeout(() => {
        navigate('/verify-premium');
      }, 1000);
      return;
    }

    // 模拟WebSocket发送
    console.log('发送消息到WebSocket:', text);

    // 模拟客服回复
    setTimeout(() => {
      const agentMessage: MessageType = {
        id: messageId + 1,
        sender: 'agent',
        text: '收到您的需求，马上为您安排',
        time: new Date().toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' })
      };
      setMessages(prev => [...prev, agentMessage]);
      setMessageId(prev => prev + 2);
    }, 1500);
  };



  const endChat = () => {
    if (confirm('确定要结束对话吗？')) {
      console.log('结束对话，跳转到 /expired');
      localStorage.removeItem('guest_sid');
      navigate('/expired');
    }
  };

  return (
    <div className="max-w-lg mx-auto h-screen flex flex-col bg-white">
      {/* Header */}
      <header className="bg-blue-600 text-white p-4 flex items-center justify-between">
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

      {/* 消息流区域 */}
      <div 
        ref={messageContainerRef}
        className="flex-1 overflow-y-auto p-4 space-y-4 scrollbar-hide" 
        id="messageContainer"
      >
        {messages.map((message) => (
          <Message key={message.id} message={message} />
        ))}
      </div>

      <ChatInput
        inputText={inputText}
        onInputChange={setInputText}
        onSendMessage={sendMessage}
        onToggleMenu={toggleMenu}
        showMenu={showMenu}
        menuItems={MOCK_MENU}
        onSelectMenuItem={selectMenuItem}
      />
    </div>
  );
};

export default ChatPage; 