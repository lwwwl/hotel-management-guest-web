import axios from 'axios';

// WebSocket连接响应类型
export interface WebSocketConnectionResponse {
  success: boolean;
  message: string;
  wsUrl: string;
  wsToken: string;
  userId: string;
  userType: string;
}

// WebSocket API配置
const WEBSOCKET_API_BASE_URL = import.meta.env.VITE_WEBSOCKET_API_URL || 'http://111.223.37.162:7766';

// 获取客人端WebSocket连接信息
export const getGuestWebSocketConnection = async (guestId: string): Promise<WebSocketConnectionResponse> => {
  try {
    const response = await axios.post(`${WEBSOCKET_API_BASE_URL}/api/websocket/connect/guest`, 
      `guestId=${guestId}`,
      {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error('获取WebSocket连接信息失败:', error);
    throw new Error('获取WebSocket连接信息失败');
  }
};

// 检查客人在线状态
export const checkGuestStatus = async (guestId: string) => {
  try {
    const response = await axios.get(`${WEBSOCKET_API_BASE_URL}/api/websocket/status/${guestId}`);
    return response.data;
  } catch (error) {
    console.error('检查在线状态失败:', error);
    throw new Error('检查在线状态失败');
  }
};

// 获取在线统计
export const getOnlineStats = async () => {
  try {
    const response = await axios.get(`${WEBSOCKET_API_BASE_URL}/api/websocket/stats`);
    return response.data;
  } catch (error) {
    console.error('获取在线统计失败:', error);
    throw new Error('获取在线统计失败');
  }
};
