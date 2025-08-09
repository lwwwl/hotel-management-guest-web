import React from 'react';
import type { QuickService, LanguageTexts } from '../types';

interface ServiceModalProps {
  isOpen: boolean;
  selectedService: QuickService | null;
  serviceNote: string;
  onServiceNoteChange: (note: string) => void;
  onConfirm: () => void;
  onCancel: () => void;
  texts: LanguageTexts;
}

const ServiceModal: React.FC<ServiceModalProps> = ({
  isOpen,
  selectedService,
  serviceNote,
  onServiceNoteChange,
  onConfirm,
  onCancel,
  texts
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4">
        <h3 className="text-lg font-semibold mb-4">{texts.serviceRequest}</h3>
        {selectedService && (
          <div className="space-y-4">
            <div className="flex items-center space-x-3">
              <i className={`${selectedService.icon} text-2xl text-blue-600`}></i>
              <div>
                <h4 className="font-medium">{selectedService.name}</h4>
                <p className="text-sm text-gray-600">{selectedService.description}</p>
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {texts.additionalNotes}
              </label>
              <textarea 
                value={serviceNote}
                onChange={(e) => onServiceNoteChange(e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                rows={3}
                placeholder={texts.serviceNotePlaceholder}
              />
            </div>
            
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
              <p className="text-blue-800 text-sm">{texts.serviceInfo}</p>
            </div>
          </div>
        )}
        
        <div className="flex justify-end space-x-2 mt-6">
          <button 
            className="px-4 py-2 text-gray-600 hover:text-gray-800"
            onClick={onCancel}
          >
            {texts.cancel}
          </button>
          <button 
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            onClick={onConfirm}
            data-testid="confirm-service"
          >
            {texts.confirm}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ServiceModal; 