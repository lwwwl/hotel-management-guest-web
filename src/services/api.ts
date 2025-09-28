import axios from 'axios';
import { authService } from './authService';
import { API_BASE_URL } from '../constants';

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// 请求拦截器，用于动态添加认证信息
apiClient.interceptors.request.use(
  (config) => {
    const guestId = authService.getCurrentGuestId() || '5'; // 使用'5'作为默认值
    
    // 为新接口添加X-Guest-Id
    config.headers['X-Guest-Id'] = guestId;

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default apiClient;
