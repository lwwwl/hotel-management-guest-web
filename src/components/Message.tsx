import React from 'react';
import type { Message as MessageType } from '../types';

interface MessageProps {
  message: MessageType;
}

const Message: React.FC<MessageProps> = ({ message }) => {
  const isGuest = message.sender === 'guest';
  
  return (
    <div className={isGuest ? 'flex justify-end' : 'flex justify-start'}>
      <div 
        className={`max-w-xs px-4 py-3 rounded-lg ${
          isGuest 
            ? 'bg-blue-600 text-white' 
            : 'bg-gray-200 text-gray-800'
        }`}
      >
        <p className="text-sm">{message.text}</p>
        <p className="text-xs mt-1 opacity-70">{message.time}</p>
      </div>
    </div>
  );
};

export default Message; 