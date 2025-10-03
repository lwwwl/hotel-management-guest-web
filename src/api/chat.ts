import type { Message } from '../types';
import api from '../services/api';

interface CreateMessageRequest {
  content: string;
  conversationId: number;
}

interface MessageListResponse {
  messages: Message[];
}

interface MessageListRequest {
  before?: number;
  conversationId: number;
}

export const chatAPI = {
  // 创建消息
  async createMessage(content: string, conversationId: number): Promise<Message> {
    const response = await api.post<Message>('/chat-guest/create-message', {
      content,
      conversationId
    } as CreateMessageRequest);
    return response.data;
  },

  // 获取消息列表
  async getMessageList(params: MessageListRequest): Promise<MessageListResponse> {
    const response = await api.post<MessageListResponse>('/chat-guest/message-list', params);
    return response.data;
  }
};
