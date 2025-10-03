import Cookies from 'js-cookie';
import api from './api';

// 定义接口返回的数据结构
export interface GuestLoginResponse {
  id: number;
  guestName: string;
  roomName: string | null;
  phoneSuffix: string;
  checkInTime: string | null;
  leaveTime: string | null;
  verify: boolean;
  chatwootContactId: number;
  chatwootSourceId: string;
  chatwootConversationId: number;
  createTime: string;
  updateTime: string;
}

class AuthService {
  private readonly GUEST_ID_COOKIE = 'guestId';
  private readonly CHATWOOT_CONTACT_ID_COOKIE = 'chatwootContactId';
  private readonly GUEST_NAME_STORAGE = 'guestName';
  private readonly ROOM_NAME_STORAGE = 'roomName';

  /**
   * 使用姓名和电话后四位登录
   */
  async login(
    guestName: string,
    phoneSuffix: string,
    roomName: string
  ): Promise<GuestLoginResponse> {
    try {
      const response = await api.post<GuestLoginResponse>('/chat-guest/create', {
        guestName,
        phoneSuffix,
        roomName
      });

      if (response.data && response.data.id) {
        // 登录成功，将guestId存入cookie
        Cookies.set(this.GUEST_ID_COOKIE, response.data.id.toString(), {
          expires: 1, // 1天过期
          secure: import.meta.env.MODE === 'production',
          sameSite: 'strict',
        });
        Cookies.set(this.CHATWOOT_CONTACT_ID_COOKIE, response.data.chatwootContactId.toString(), {
          expires: 1, // 1天过期
          secure: import.meta.env.MODE === 'production',
          sameSite: 'strict',
        });
        sessionStorage.setItem(this.GUEST_NAME_STORAGE, response.data.guestName);
        if (response.data.roomName) {
          sessionStorage.setItem(this.ROOM_NAME_STORAGE, response.data.roomName);
        }
      }
      return response.data;
    } catch (error) {
      console.error('登录失败:', error);
      throw error;
    }
  }

  /**
   * 获取当前guestId
   */
  getCurrentGuestId(): string | undefined {
    return Cookies.get(this.GUEST_ID_COOKIE);
  }

  /**
   * 获取当前 contactId
   */
  getCurrentChatwootContactId(): string | undefined {
    return Cookies.get(this.CHATWOOT_CONTACT_ID_COOKIE);
  }

  /**
   * 获取当前访客姓名
   */
  getGuestName(): string | null {
    return sessionStorage.getItem(this.GUEST_NAME_STORAGE);
  }

  /**
   * 获取当前房间号
   */
  getRoomName(): string | null {
    return sessionStorage.getItem(this.ROOM_NAME_STORAGE);
  }


  /**
   * 检查是否已登录
   */
  isLoggedIn(): boolean {
    return !!this.getCurrentGuestId();
  }

  /**
   * 登出，清除cookie
   */
  logout(): void {
    Cookies.remove(this.GUEST_ID_COOKIE);
    Cookies.remove(this.CHATWOOT_CONTACT_ID_COOKIE);
    sessionStorage.removeItem(this.GUEST_NAME_STORAGE);
    sessionStorage.removeItem(this.ROOM_NAME_STORAGE);
  }
}

// 导出单例实例
export const authService = new AuthService();
export default authService;
