import api from '../services/api';
import type { QuickMenuItem } from '../types';

interface QuickMenuListResponse {
  statusCode: number;
  message: string;
  data: QuickMenuItem[];
}

export const quickMenuAPI = {
  /**
   * 获取快捷菜单列表
   */
  async getQuickMenuList(): Promise<QuickMenuItem[]> {
    try {
      const response = await api.post<QuickMenuListResponse>('/chat-guest/quick-menu/list', {});
      if (response.data && response.data.statusCode === 200) {
        // 按sortOrder升序排序
        return response.data.data.sort((a, b) => a.sortOrder - b.sortOrder);
      } else {
        throw new Error(response.data.message || 'Failed to fetch quick menu list');
      }
    } catch (error) {
      console.error('Error fetching quick menu list:', error);
      throw error;
    }
  }
};
