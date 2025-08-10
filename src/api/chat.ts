import type { Message } from '../types';

const BASE_URL = 'http://111.223.37.162:7788';

interface CreateMessageRequest {
  content: string;
}

interface CreateMessageResponse {
  id: number;
  content: string;
  message_type: number;
  content_type: string;
  content_attributes: Record<string, any>;
  created_at: number;
  conversation_id: number;
  sender: {
    additional_attributes: {
      age: number;
      type: string;
      roomId: number;
      roomName: string;
      leaveTime: number;
      checkInTime: number;
    };
    custom_attributes: Record<string, any>;
    email: string | null;
    id: number;
    identifier: string;
    name: string;
    phone_number: string | null;
    thumbnail: string;
    blocked: boolean;
    type: string;
  };
}

interface MessageListResponse {
  messages: Message[];
}

const headers = {
  'Content-Type': 'application/json',
  'X-Guest-Id': '5'
};

export const chatAPI = {
  // 创建消息
  async createMessage(content: string): Promise<CreateMessageResponse> {
    const response = await fetch(`${BASE_URL}/chat-guest/create-message`, {
      method: 'POST',
      headers,
      body: JSON.stringify({ content } as CreateMessageRequest)
    });

    if (!response.ok) {
      throw new Error(`Failed to create message: ${response.status}`);
    }

    return response.json();
  },

  // 获取消息列表
  async getMessageList(): Promise<MessageListResponse> {
    const response = await fetch(`${BASE_URL}/chat-guest/message-list`, {
      method: 'POST',
      headers
    });

    if (!response.ok) {
      throw new Error(`Failed to get message list: ${response.status}`);
    }

    return response.json();
  }
};
