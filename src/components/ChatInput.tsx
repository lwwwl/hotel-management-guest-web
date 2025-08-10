import React from 'react';
import type { MenuItem } from '../types';

interface ChatInputProps {
  inputText: string;
  onInputChange: (text: string) => void;
  onSendMessage: () => void;
  onToggleMenu: () => void;
  showMenu: boolean;
  menuItems: MenuItem[];
  onSelectMenuItem: (item: MenuItem) => void;
  disabled?: boolean;
}

const ChatInput: React.FC<ChatInputProps> = ({
  inputText,
  onInputChange,
  onSendMessage,
  onToggleMenu,
  showMenu,
  menuItems,
  onSelectMenuItem,
  disabled = false
}) => {
  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !disabled) {
      onSendMessage();
    }
  };

  return (
    <>
      {/* 多级菜单 */}
      {showMenu && (
        <div className="border-t bg-gray-50 p-2">
          <div className="grid grid-cols-2 gap-2">
            {menuItems.map((item) => (
              <button 
                key={item.id}
                onClick={() => onSelectMenuItem(item)}
                data-testid={`menu-${item.id}`}
                className="bg-white border border-gray-300 rounded-lg p-3 text-sm hover:bg-blue-50 hover:border-blue-400 transition-colors"
              >
                <i className={`${item.icon} text-lg mb-1`}></i>
                <p>{item.label}</p>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* 输入区域 */}
      <div className="border-t p-4 bg-white">
        <div className="flex items-center space-x-2">
          <button 
            onClick={onToggleMenu}
            data-testid="menu-toggle"
            disabled={disabled}
            className="p-2 hover:bg-gray-100 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <i className="uil uil-apps text-xl text-gray-600"></i>
          </button>
          <input 
            type="text"
            value={inputText}
            onChange={(e) => onInputChange(e.target.value)}
            onKeyPress={handleKeyPress}
            data-testid="message-input"
            placeholder={disabled ? "发送中..." : "输入消息..."}
            disabled={disabled}
            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:opacity-50 disabled:cursor-not-allowed"
          />
          <button 
            onClick={onSendMessage}
            data-testid="send-button"
            disabled={!inputText.trim() || disabled}
            className="p-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <i className={`uil ${disabled ? 'uil-spinner' : 'uil-message'} text-xl ${disabled ? 'animate-spin' : ''}`}></i>
          </button>
        </div>
      </div>
    </>
  );
};

export default ChatInput; 