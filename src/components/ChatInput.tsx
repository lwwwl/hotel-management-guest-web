import React from 'react';

interface ChatInputProps {
  inputText: string;
  onInputChange: (text: string) => void;
  onSendMessage: () => void;
  onToggleQuickMenu: () => void;
  disabled?: boolean;
}

const ChatInput: React.FC<ChatInputProps> = ({
  inputText,
  onInputChange,
  onSendMessage,
  onToggleQuickMenu,
  disabled = false
}) => {
  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey && !disabled) {
      e.preventDefault();
      onSendMessage();
    }
  };

  return (
    <div className="border-t p-4 bg-white relative">
      <div className="flex items-center space-x-2">
        {/* 工具按钮 */}
        <button 
          onClick={onToggleQuickMenu}
          data-testid="quick-menu-toggle"
          disabled={disabled}
          className="p-2 hover:bg-gray-100 rounded-full disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          <i className="uil uil-apps text-xl text-gray-600"></i>
        </button>
        
        {/* 文本输入框 */}
        <textarea
          rows={1}
          value={inputText}
          onChange={(e) => onInputChange(e.target.value)}
          onKeyPress={handleKeyPress}
          data-testid="message-input"
          placeholder={disabled ? "发送中..." : "输入消息..."}
          disabled={disabled}
          className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:opacity-50 resize-none max-h-24 scrollbar-hide"
          style={{ height: 'auto', minHeight: '42px' }}
        />
        
        {/* 发送按钮 */}
        <button 
          onClick={onSendMessage}
          data-testid="send-button"
          disabled={!inputText.trim() || disabled}
          className="w-10 h-10 flex items-center justify-center bg-blue-600 text-white rounded-full hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all shrink-0"
        >
          <i className={`uil ${disabled ? 'uil-spinner-alt' : 'uil-message'} text-xl ${disabled ? 'animate-spin' : ''}`}></i>
        </button>
      </div>
    </div>
  );
};

export default ChatInput; 