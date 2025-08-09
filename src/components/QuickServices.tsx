import React from 'react';
import type { QuickService } from '../types';

interface QuickServicesProps {
  services: QuickService[];
  onServiceClick: (service: QuickService) => void;
}

const QuickServices: React.FC<QuickServicesProps> = ({ services, onServiceClick }) => {
  return (
    <div className="grid grid-cols-2 gap-3">
      {services.map((service) => (
        <button 
          key={service.id}
          onClick={() => onServiceClick(service)}
          className="flex flex-col items-center p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
          data-testid={`service-${service.id}`}
        >
          <i className={`${service.icon} text-2xl text-blue-600 mb-2`}></i>
          <span className="text-sm font-medium text-gray-700">{service.name}</span>
        </button>
      ))}
    </div>
  );
};

export default QuickServices; 