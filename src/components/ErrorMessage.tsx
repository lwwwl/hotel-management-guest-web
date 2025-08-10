import React from 'react';

interface ErrorMessageProps {
  message: string;
  onClose?: () => void;
}

const ErrorMessage: React.FC<ErrorMessageProps> = ({ message, onClose }) => {
  return (
    <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mx-4 mt-2 flex items-center justify-between">
      <span>{message}</span>
      {onClose && (
        <button
          onClick={onClose}
          className="text-red-700 hover:text-red-900 ml-2"
        >
          <i className="uil uil-times text-lg"></i>
        </button>
      )}
    </div>
  );
};

export default ErrorMessage;
