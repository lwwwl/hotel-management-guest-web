import { useState, useEffect, useCallback, useRef } from 'react';
import type { Message, LanguageCode } from '../types';
import { chatAPI } from '../api/chat';
import { translateAPI } from '../api/translate';
import type { SupportedLanguage } from '../contexts/LanguageContext';

// 映射全局语言到翻译API所需的语言代码
const languageMap: Record<SupportedLanguage, LanguageCode> = {
  zh: 'zh_CN',
  en: 'en_US',
  ja: 'ja_JP',
};

export const useMessages = (language: SupportedLanguage, conversationId: number | null) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true); // Renamed for clarity, true on initial mount
  const [loadingMore, setLoadingMore] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Translation state
  const [translateEnabled, setTranslateEnabled] = useState(false);
  const [translationLoading, setTranslationLoading] = useState(false);
  const [translationError, setTranslationError] = useState<string | null>(null);

  const currentLangCode = languageMap[language];

  // --- Translation Logic ---
  const translateMessages = useCallback(async (messagesToTranslate: Message[], langCode: LanguageCode, conversationId: number) => {
    if (messagesToTranslate.length === 0) return;

    setTranslationLoading(true);
    setMessages(prev => prev.map(m => messagesToTranslate.find(mt => mt.id === m.id) ? { ...m, translationLoading: true, translationError: false } : m));

    try {
      const response = await translateAPI.getTranslateResult({
        conversationId,
        messages: messagesToTranslate.map(m => ({ messageId: m.id, content: m.content })),
        language: langCode,
      });

      const translations = response.data.reduce((acc, item) => {
        acc[item.messageId] = item.result;
        return acc;
      }, {} as Record<number, string>);

      setMessages(prev => prev.map(m => translations[m.id] ? {
        ...m,
        translation: translations[m.id],
        translationLoading: false,
        translationError: false,
      } : m));

    } catch (err) {
      console.error('Failed to translate messages:', err);
      setMessages(prev => prev.map(m => messagesToTranslate.find(mt => mt.id === m.id) ? { ...m, translationLoading: false, translationError: true } : m));
    } finally {
      setTranslationLoading(false);
    }
  }, []);

  // --- Original Logic Modified for Translation ---
  const loadMessages = useCallback(async (before?: number) => {
    if (!conversationId) {
      setLoading(false);
      return;
    }
    
    if (!before) {
      setLoading(true);
    } else {
      setLoadingMore(true);
    }
    setError(null);
    try {
      const response = await chatAPI.getMessageList({ before, conversationId });
      
      if (response.messages.length === 0) {
        setHasMore(false);
        return;
      }

      setMessages(prev => before ? [...response.messages, ...prev] : response.messages);
      
    } catch (err) {
      console.error('Failed to load messages:', err);
      setError('加载消息失败，请稍后重试');
    } finally {
      if (!before) {
        setLoading(false);
      } else {
        setLoadingMore(false);
      }
    }
  }, [conversationId]);

  const loadMoreMessages = useCallback(() => {
    if (loading || loadingMore || !hasMore) return;
    const firstMessageId = messages[0]?.id;
    if (firstMessageId) {
      loadMessages(firstMessageId);
    }
  }, [loading, loadingMore, hasMore, messages, loadMessages]);

  const sendMessage = useCallback(async (content: string) => {
    if (!content.trim() || sending || !conversationId) return;

    try {
      setSending(true);
      setError(null);
      
      const response = await chatAPI.createMessage(content.trim(), conversationId);
      setMessages(prev => [...prev, response]);
      
      if (translateEnabled) {
        setTimeout(() => translateMessages([response], currentLangCode, response.conversation_id), 0);
      }
      
      return response;
    } catch (err) {
      console.error('Failed to send message:', err);
      setError('发送消息失败，请稍后重试');
      throw err;
    } finally {
      setSending(false);
    }
  }, [sending, translateEnabled, currentLangCode, translateMessages, conversationId]);

  const addMessage = useCallback((message: Message) => {
    setMessages(prev => {
      const newMessages = [...prev, message];
      if (translateEnabled) {
        setTimeout(() => translateMessages([message], currentLangCode, message.conversation_id), 0);
      }
      return newMessages;
    });
  }, [translateEnabled, currentLangCode, translateMessages]);

  const updateMessage = useCallback((updatedMessage: Message) => {
    setMessages(prev => 
      prev.map(message => 
        message.id === updatedMessage.id ? updatedMessage : message
      )
    );
  }, []);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  const clearTranslationError = useCallback(() => {
    setTranslationError(null);
  }, []);

  // --- Translation Control Logic ---
  const toggleTranslate = useCallback(() => {
    const nextState = !translateEnabled;
    setTranslateEnabled(nextState);
    
    if (nextState) {
      // 当开启翻译时，翻译所有消息
      const conversationId = messages[0]?.conversation_id; // 假设所有消息来自同一个会话
      if (conversationId) {
        translateMessages(messages, currentLangCode, conversationId);
      }
    } else {
      // 当关闭翻译时，清除所有消息的翻译字段
      setMessages(prev => 
        prev.map(m => {
          const { translation, ...rest } = m;
          return rest;
        })
      );
    }
  }, [translateEnabled, translateMessages, messages, currentLangCode]);

  // Effect to run batch translation
  const prevLangRef = useRef<LanguageCode>();
  useEffect(() => {
    const hasLanguageChanged = prevLangRef.current !== undefined && prevLangRef.current !== currentLangCode;

    if (translateEnabled && messages.length > 0) {
      let messagesToTranslate;
      if (hasLanguageChanged) {
        // 如果语言已更改，则重新翻译所有消息
        messagesToTranslate = messages;
      } else {
        // 否则，仅翻译尚无翻译的消息
        messagesToTranslate = messages.filter(m => !m.translation && !m.translationLoading);
      }

      if (messagesToTranslate.length > 0) {
        const conversationId = messages[0].conversation_id; // Assume all messages are from the same conversation
        translateMessages(messagesToTranslate, currentLangCode, conversationId);
      }
    }
    // 在 effect 执行后更新 ref
    prevLangRef.current = currentLangCode;

  }, [translateEnabled, currentLangCode, messages, translateMessages]);

  useEffect(() => {
    // Only load messages if we have a valid conversationId
    if (conversationId) {
      loadMessages();
    } else {
      setLoading(false); // No ID, so stop loading
    }
  }, [conversationId, loadMessages]);

  return {
    messages,
    loading,
    loadingMore,
    hasMore,
    sending,
    error,
    loadMoreMessages,
    sendMessage,
    addMessage,
    updateMessage,
    clearError,
    // Translation exports
    translateEnabled,
    translationLoading,
    toggleTranslate,
    translationError,
    clearTranslationError,
  };
};
