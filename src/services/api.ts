import axios from 'axios';
import Cookies from 'js-cookie';
import {API_BASE_URL} from "../constants";

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// 请求拦截器
api.interceptors.request.use(
  (config) => {
    const guestId = Cookies.get('guestId');
    if (guestId) {
      config.headers['X-Guest-Id'] = guestId;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default api;
