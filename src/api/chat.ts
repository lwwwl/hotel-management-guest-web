import type { Message } from '../types';
import { API_BASE_URL } from '../constants';
import { authService } from '../services/authService';

interface CreateMessageRequest {
  content: string;
}

interface MessageListResponse {
  messages: Message[];
}

interface MessageListRequest {
  before?: number;
}

const getHeaders = () => {
  const guestId = authService.getCurrentGuestId() || '5';
  return {
    'Content-Type': 'application/json',
    'X-Guest-Id': guestId,
    'userId': guestId
  };
};

export const chatAPI = {
  // 创建消息
  async createMessage(content: string): Promise<Message> {
    const response = await fetch(`${API_BASE_URL}/chat-guest/create-message`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify({ content } as CreateMessageRequest)
    });

    if (!response.ok) {
      throw new Error(`Failed to create message: ${response.status}`);
    }

    return response.json();
  },

  // 获取消息列表
  async getMessageList(params?: MessageListRequest): Promise<MessageListResponse> {
    const response = await fetch(`${API_BASE_URL}/chat-guest/message-list`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(params || {})
    });

    if (!response.ok) {
      throw new Error(`Failed to get message list: ${response.status}`);
    }

    return response.json();
  }
};
