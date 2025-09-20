import { useState, useEffect, useCallback, useRef } from 'react';
import type { Message, LanguageCode } from '../types';
import { chatAPI } from '../api/chat';
import { translateAPI } from '../api/translate';

export const useMessages = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(false);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Translation States
  const [translateEnabled, setTranslateEnabled] = useState(false);
  const [selectedLanguage, setSelectedLanguage] = useState<LanguageCode>('zh_CN');
  const [translationLoading, setTranslationLoading] = useState(false);

  // --- Translation Logic ---
  const translateMessages = useCallback(async (messagesToTranslate: Message[], language: LanguageCode, conversationId: number) => {
    if (messagesToTranslate.length === 0) return;

    setTranslationLoading(true);
    setMessages(prev => prev.map(m => messagesToTranslate.find(mt => mt.id === m.id) ? { ...m, translationLoading: true, translationError: false } : m));

    try {
      const response = await translateAPI.getTranslateResult({
        conversationId,
        messages: messagesToTranslate.map(m => ({ messageId: m.id, content: m.content })),
        language,
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

  const sendMessage = useCallback(async (content: string) => {
    if (!content.trim() || sending) return;

    try {
      setSending(true);
      setError(null);
      
      const response = await chatAPI.createMessage(content.trim());
      setMessages(prev => [...prev, response]);
      
      if (translateEnabled) {
        setTimeout(() => translateMessages([response], selectedLanguage, response.conversation_id), 0);
      }
      
      return response;
    } catch (err) {
      console.error('Failed to send message:', err);
      setError('发送消息失败，请稍后重试');
      throw err;
    } finally {
      setSending(false);
    }
  }, [sending, translateEnabled, selectedLanguage, translateMessages]);

  const addMessage = useCallback((message: Message) => {
    setMessages(prev => {
      const newMessages = [...prev, message];
      if (translateEnabled) {
        setTimeout(() => translateMessages([message], selectedLanguage, message.conversation_id), 0);
      }
      return newMessages;
    });
  }, [translateEnabled, selectedLanguage, translateMessages]);

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

  // --- Translation Control Logic ---
  const toggleTranslate = useCallback((enabled: boolean) => {
    setTranslateEnabled(enabled);
    if (!enabled) {
      setMessages(prev => prev.map(m => ({ ...m, translation: undefined, translationLoading: false, translationError: false })));
    }
  }, []);

  const changeTranslateLanguage = useCallback((language: LanguageCode) => {
    setSelectedLanguage(language);
  }, []);

  // Effect to run batch translation
  const prevLangRef = useRef<LanguageCode>();
  useEffect(() => {
    const hasLanguageChanged = prevLangRef.current !== undefined && prevLangRef.current !== selectedLanguage;

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
        translateMessages(messagesToTranslate, selectedLanguage, conversationId);
      }
    }
    // 在 effect 执行后更新 ref
    prevLangRef.current = selectedLanguage;

  }, [translateEnabled, selectedLanguage, messages, translateMessages]);

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
    clearError,
    // Translation exports
    translateEnabled,
    selectedLanguage,
    translationLoading,
    toggleTranslate,
    changeTranslateLanguage,
  };
};
