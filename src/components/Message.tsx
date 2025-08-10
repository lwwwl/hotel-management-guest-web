import React from 'react';
import type { Message as MessageType } from '../types';
import { formatTimestamp } from '../utils/time';

interface MessageProps {
  message: MessageType;
}

const Message: React.FC<MessageProps> = ({ message }) => {
  const isGuest = message.message_type === 0;
  
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
      </div>
    </div>
  );
};

export default Message; 