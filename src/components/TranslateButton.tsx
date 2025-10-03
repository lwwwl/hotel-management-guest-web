import React from 'react';
import { useTranslations } from '../contexts/useTranslations';

interface TranslateButtonProps {
  onClick: () => void;
  isTranslating: boolean;
  isLoading: boolean;
  className?: string;
}

const TranslateButton: React.FC<TranslateButtonProps> = ({
  onClick,
  isTranslating,
  isLoading,
  className = '',
}) => {
  const texts = useTranslations();
  const buttonClasses = `
    relative flex items-center justify-center h-10 w-10 
    text-white transition-colors duration-200
    hover:bg-blue-700 rounded-full
    focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-blue-600 focus:ring-white
    ${className}
  `;

  const iconClasses = `
    text-2xl 
    ${isTranslating ? 'text-green-300' : 'text-white'}
  `;

  return (
    <button
      type="button"
      onClick={onClick}
      className={buttonClasses}
      title={isTranslating ? texts.disableAutoTranslate : texts.enableAutoTranslate}
      disabled={isLoading}
    >
      {isLoading ? (
        <i className="uil uil-spinner-alt animate-spin text-2xl"></i>
      ) : (
        <i className={`uil uil-language ${iconClasses}`}></i>
      )}
    </button>
  );
};

export default TranslateButton;
