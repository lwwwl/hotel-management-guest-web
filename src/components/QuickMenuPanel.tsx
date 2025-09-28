import React from 'react';
import type { QuickMenuItem, ParsedQuickMenuContent } from '../types';
import type { SupportedLanguage } from '../contexts/LanguageContext';
import { parseQuickMenuContent } from '../utils/quickMenuParser';

interface QuickMenuPanelProps {
  items: QuickMenuItem[];
  language: SupportedLanguage;
  onSelectItem: (message: string) => void;
  onClose: () => void;
  // Translation props
  translateEnabled: boolean;
  onToggleTranslate: (enabled: boolean) => void;
  translationLoading: boolean;
}

// Icon mapping from backend names to Unicons classes
const backendIconMap: { [key: string]: string } = {
  HelpCircle: 'uil-question-circle',
  Bell: 'uil-bell',
  Car: 'uil-car-sideview',
  Clean: 'uil-brush-alt',
  default: 'uil-comment-alt-notes'
};

const getIconClass = (iconName: string): string => {
  // 尝试完全匹配
  if (backendIconMap[iconName]) {
    return backendIconMap[iconName];
  }
  // 尝试不区分大小写匹配
  const lowerIconName = iconName.toLowerCase();
  for (const key in backendIconMap) {
    if (key.toLowerCase() === lowerIconName) {
      return backendIconMap[key];
    }
  }
  return backendIconMap.default;
};


const QuickMenuPanel: React.FC<QuickMenuPanelProps> = ({ 
  items, 
  language, 
  onSelectItem, 
  onClose,
  translateEnabled,
  onToggleTranslate,
  translationLoading
}) => {
  // 过滤掉无法解析或内容为空的菜单项
  const validItems = items.map(item => {
    const content = parseQuickMenuContent(item.content);
    return content ? { ...item, parsedContent: content } : null;
  }).filter(Boolean) as (QuickMenuItem & { parsedContent: ParsedQuickMenuContent })[];

  const handleItemClick = (content: ParsedQuickMenuContent) => {
    const message = content.message[language] || content.message.zh;
    onSelectItem(message);
    onClose();
  };

  return (
    <div className="absolute bottom-full left-0 mb-2 w-full bg-white border border-gray-200 rounded-lg shadow-xl z-10">
      <div className="p-2">
        <h3 className="text-sm font-semibold text-gray-700 px-2 pb-1">快捷菜单</h3>
        <div className="grid grid-cols-3 gap-2">
          {/* Quick Menu Items */}
          {validItems.map(item => (
            <button
              key={item.id}
              onClick={() => handleItemClick(item.parsedContent)}
              className="flex flex-col items-center justify-center p-2 rounded-lg hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-400 text-center"
            >
              <i className={`${getIconClass(item.icon)} text-2xl text-blue-600 mb-1`}></i>
              <span className="text-xs text-gray-600 leading-tight">
                {item.parsedContent.name[language] || item.parsedContent.name.zh}
              </span>
            </button>
          ))}
          
          {/* Divider and Translate Toggle */}
          <div className="col-span-3 border-t my-1"></div>

          <button
            onClick={() => onToggleTranslate(!translateEnabled)}
            disabled={translationLoading}
            className="col-span-3 flex items-center justify-center p-2 rounded-lg hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-400 disabled:opacity-50"
          >
            {translationLoading ? (
              <i className="uil uil-spinner-alt text-2xl text-gray-500 animate-spin"></i>
            ) : (
              <i className={`uil uil-language text-2xl ${translateEnabled ? 'text-blue-600' : 'text-gray-500'}`}></i>
            )}
            <span className={`ml-2 text-sm ${translateEnabled ? 'text-gray-800' : 'text-gray-600'}`}>
              自动翻译
            </span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default QuickMenuPanel;
