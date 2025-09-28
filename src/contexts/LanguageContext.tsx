import React, { createContext, useState, useContext, useEffect, ReactNode } from 'react';

// 支持的语言类型
export type SupportedLanguage = 'zh' | 'en' | 'ja';

// Context接口定义
interface LanguageContextType {
  language: SupportedLanguage;
  setLanguage: (language: SupportedLanguage) => void;
}

// 创建Context，提供一个默认值
const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

// LanguageProvider组件
interface LanguageProviderProps {
  children: ReactNode;
}

export const LanguageProvider: React.FC<LanguageProviderProps> = ({ children }) => {
  const [language, setLanguageState] = useState<SupportedLanguage>(() => {
    // 尝试从localStorage获取已保存的语言，否则默认为'zh'
    const savedLanguage = localStorage.getItem('guest_app_language') as SupportedLanguage;
    return savedLanguage || 'zh';
  });

  // 当语言状态变化时，更新localStorage
  useEffect(() => {
    localStorage.setItem('guest_app_language', language);
  }, [language]);

  const setLanguage = (newLanguage: SupportedLanguage) => {
    setLanguageState(newLanguage);
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage }}>
      {children}
    </LanguageContext.Provider>
  );
};

// 自定义Hook，方便消费Context
export const useLanguage = (): LanguageContextType => {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage必须在LanguageProvider内部使用');
  }
  return context;
};
