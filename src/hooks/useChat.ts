import { useState, useEffect, useRef } from 'react';
import { MOCK_MESSAGES, getQuickServices } from '../constants/index';
import type { Message } from '../types';

export const useChat = () => {
  const [messages, setMessages] = useState<Message[]>([...MOCK_MESSAGES]);
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

  const sendMessage = async () => {
    if (!inputText.trim()) return;

    const text = inputText;
    const time = new Date().toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' });

    // 添加用户消息
    const newMessage: Message = {
      id: messageId,
      sender: 'guest',
      text: text,
      time: time
    };

    setMessages(prev => [...prev, newMessage]);
    setInputText('');
    setMessageId(prev => prev + 1);

    // 模拟客服回复
    setTimeout(() => {
      const agentMessage: Message = {
        id: messageId + 1,
        sender: 'agent',
        text: '收到您的需求，马上为您安排',
        time: new Date().toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' })
      };
      setMessages(prev => [...prev, agentMessage]);
      setMessageId(prev => prev + 2);
    }, 1500);
  };

  return {
    messages,
    inputText,
    setInputText,
    showMenu,
    toggleMenu,
    sendMessage,
    messageContainerRef
  };
}; 