import apiClient from './api';
import type { QuickMenuItem } from '../types';

interface QuickMenuListResponse {
  statusCode: number;
  message: string;
  data: QuickMenuItem[];
}

/**
 * 获取快捷菜单列表
 */
export const getQuickMenuList = async (): Promise<QuickMenuItem[]> => {
  try {
    const response = await apiClient.post<QuickMenuListResponse>('/quickMenu-guest/list', {});
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
};
