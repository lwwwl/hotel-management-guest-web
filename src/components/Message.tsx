import React from 'react';
import type { Message as MessageType } from '../types';
import { formatTimestamp } from '../utils/time';

interface MessageProps {
  message: MessageType;
}

const Message: React.FC<MessageProps> = ({ message }) => {
  const isGuest = message.message_type === 0;

  const TranslationArea = () => (
    <div className="mt-2 pt-2 border-t border-opacity-20 border-current">
      <div className="flex items-center space-x-2 text-xs">
        <span className="font-medium opacity-75">翻译:</span>
        {message.translationLoading && (
          <div className="flex items-center space-x-1">
            <div className="animate-spin w-3 h-3 border border-current border-t-transparent rounded-full"></div>
            <span className="opacity-75">翻译中...</span>
          </div>
        )}
        {message.translationError && (
          <span className="opacity-75 text-red-300">翻译失败</span>
        )}
        {message.translation && !message.translationLoading && !message.translationError && (
          <span className="opacity-75 italic">{message.translation}</span>
        )}
      </div>
    </div>
  );

  return (
    <div className={isGuest ? 'flex justify-end' : 'flex justify-start'}>
      <div 
        className={`max-w-xs px-4 py-3 rounded-lg ${
          isGuest 
            ? 'bg-blue-600 text-white' 
            : 'bg-gray-200 text-gray-800'
        }`}
      >
        <p className="text-sm">{message.content}</p>
        <p className="text-xs mt-1 opacity-70">{formatTimestamp(message.created_at)}</p>
        {(message.translation || message.translationLoading || message.translationError) && <TranslationArea />}
      </div>
    </div>
  );
};

export default Message; 