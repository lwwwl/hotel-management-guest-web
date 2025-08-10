import { useState, useEffect, useCallback } from 'react';
import type { Message } from '../types';
import { chatAPI } from '../api/chat';

export const useMessages = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(false);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // 加载消息列表
  const loadMessages = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await chatAPI.getMessageList();
      setMessages(response.messages);
    } catch (err) {
      console.error('Failed to load messages:', err);
      setError('加载消息失败，请稍后重试');
    } finally {
      setLoading(false);
    }
  }, []);

  // 发送消息
  const sendMessage = useCallback(async (content: string) => {
    if (!content.trim() || sending) return;

    try {
      setSending(true);
      setError(null);
      
      const response = await chatAPI.createMessage(content.trim());
      setMessages(prev => [...prev, response]);
      
      return response;
    } catch (err) {
      console.error('Failed to send message:', err);
      setError('发送消息失败，请稍后重试');
      throw err;
    } finally {
      setSending(false);
    }
  }, [sending]);

  // 添加消息到列表（用于实时消息）
  const addMessage = useCallback((message: Message) => {
    setMessages(prev => [...prev, message]);
  }, []);

  // 更新消息（用于消息更新）
  const updateMessage = useCallback((updatedMessage: Message) => {
    setMessages(prev => 
      prev.map(message => 
        message.id === updatedMessage.id ? updatedMessage : message
      )
    );
  }, []);

  // 清除错误
  const clearError = useCallback(() => {
    setError(null);
  }, []);

  // 初始加载
  useEffect(() => {
    loadMessages();
  }, [loadMessages]);

  return {
    messages,
    loading,
    sending,
    error,
    loadMessages,
    sendMessage,
    addMessage,
    updateMessage,
    clearError
  };
};
