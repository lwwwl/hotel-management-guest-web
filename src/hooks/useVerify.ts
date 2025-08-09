import { useState } from 'react';
import { MOCK, LANGUAGES, getQuickServices } from '../constants';
import type { QuickService } from '../types';

export const useVerify = () => {
  const [currentLanguage, setCurrentLanguage] = useState('zh');
  const [verifyCode, setVerifyCode] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [showServiceModal, setShowServiceModal] = useState(false);
  const [selectedService, setSelectedService] = useState<QuickService | null>(null);
  const [serviceNote, setServiceNote] = useState('');

  const texts = LANGUAGES[currentLanguage] || LANGUAGES.zh;
  const quickServices = getQuickServices(currentLanguage);

  const handleVerify = async () => {
    setLoading(true);
    setErrorMessage('');

    try {
      // 模拟API调用
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      if (MOCK.validCodes.includes(verifyCode)) {
        // 成功 - 存储JWT并跳转
        localStorage.setItem('guest_sid', 'mock_jwt_token_' + Date.now());
        console.log('验证成功，准备跳转到 /chat');
        alert(texts.verifySuccess);
        return { success: true };
      } else {
        // 失败 - 显示错误
        setErrorMessage(texts.verifyFailed);
        setVerifyCode('');
        return { success: false };
      }
    } catch (error) {
      setErrorMessage(texts.networkError);
      return { success: false };
    } finally {
      setLoading(false);
    }
  };

  const requestService = (service: QuickService) => {
    setSelectedService(service);
    setShowServiceModal(true);
    console.log('请求服务:', service.name);
  };

  const confirmService = () => {
    if (!selectedService) return;
    
    console.log('确认服务请求:', {
      service: selectedService.name,
      room: MOCK.roomNumber,
      note: serviceNote,
      language: currentLanguage
    });
    
    // 模拟API调用
    setTimeout(() => {
      alert(texts.serviceConfirmed);
      setShowServiceModal(false);
      setSelectedService(null);
      setServiceNote('');
    }, 500);
  };

  return {
    currentLanguage,
    setCurrentLanguage,
    verifyCode,
    setVerifyCode,
    errorMessage,
    loading,
    showServiceModal,
    selectedService,
    serviceNote,
    setServiceNote,
    texts,
    quickServices,
    handleVerify,
    requestService,
    confirmService,
    setShowServiceModal,
    setSelectedService
  };
}; 