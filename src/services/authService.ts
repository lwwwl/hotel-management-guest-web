// 模拟的认证服务，用于管理登录信息和guestId
// 在实际项目中，这里会与后端API交互

export interface LoginInfo {
  guestId: string;
  roomNumber: string;
  loginTime: number;
  token: string;
}

class AuthService {
  private readonly STORAGE_KEY = 'hotel_guest_login_info';
  private readonly DEFAULT_GUEST_ID = '5'; // 写死的默认guestId

  /**
   * 获取当前登录信息
   */
  getLoginInfo(): LoginInfo | null {
    try {
      const stored = localStorage.getItem(this.STORAGE_KEY);
      if (stored) {
        const loginInfo = JSON.parse(stored);
        // 检查token是否过期（24小时）
        if (Date.now() - loginInfo.loginTime < 24 * 60 * 60 * 1000) {
          return loginInfo;
        }
        // token过期，清除存储
        this.clearLoginInfo();
      }
      return null;
    } catch (error) {
      console.error('获取登录信息失败:', error);
      return null;
    }
  }

  /**
   * 设置登录信息
   */
  setLoginInfo(roomNumber: string): LoginInfo {
    const loginInfo: LoginInfo = {
      guestId: this.DEFAULT_GUEST_ID, // 使用写死的guestId
      roomNumber,
      loginTime: Date.now(),
      token: `mock_jwt_token_${Date.now()}`
    };

    try {
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(loginInfo));
      console.log('登录信息已保存:', loginInfo);
    } catch (error) {
      console.error('保存登录信息失败:', error);
    }

    return loginInfo;
  }

  /**
   * 获取当前guestId
   */
  getCurrentGuestId(): string {
    const loginInfo = this.getLoginInfo();
    return loginInfo?.guestId || this.DEFAULT_GUEST_ID;
  }

  /**
   * 获取当前房间号
   */
  getCurrentRoomNumber(): string | null {
    const loginInfo = this.getLoginInfo();
    return loginInfo?.roomNumber || null;
  }

  /**
   * 检查是否已登录
   */
  isLoggedIn(): boolean {
    return this.getLoginInfo() !== null;
  }

  /**
   * 清除登录信息
   */
  clearLoginInfo(): void {
    try {
      localStorage.removeItem(this.STORAGE_KEY);
      console.log('登录信息已清除');
    } catch (error) {
      console.error('清除登录信息失败:', error);
    }
  }

  /**
   * 模拟登录验证
   */
  async mockLogin(verifyCode: string, roomNumber: string): Promise<boolean> {
    // 模拟API调用延迟
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // 这里使用MOCK.validCodes进行验证，实际项目中会调用后端API
    const validCodes = ['张三', '1234', '李四', '5678'];
    const isValid = validCodes.includes(verifyCode);
    
    if (isValid) {
      // 验证成功，保存登录信息
      this.setLoginInfo(roomNumber);
    }
    
    return isValid;
  }
}

// 导出单例实例
export const authService = new AuthService();
export default authService;
