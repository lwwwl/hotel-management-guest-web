# 认证服务 (AuthService) 说明

## 概述

`AuthService` 是一个模拟的认证服务，用于管理客人端的登录信息和 `guestId`。它提供了一个统一的接口来管理登录状态、存储用户信息，并为 WebSocket 连接提供必要的 `guestId`。

## 主要功能

### 1. 登录信息管理
- **存储登录信息**: 包括 `guestId`、房间号、登录时间和 token
- **获取登录信息**: 从本地存储中读取登录信息
- **清除登录信息**: 登出时清除所有存储的信息

### 2. GuestId 管理
- **默认 GuestId**: 硬编码为 `"1"`，符合用户要求
- **动态获取**: 通过 `getCurrentGuestId()` 方法获取当前登录的 guestId
- **持久化存储**: 使用 localStorage 保存，支持页面刷新后保持状态

### 3. 模拟登录验证
- **验证逻辑**: 使用预定义的验证码进行模拟验证
- **自动存储**: 验证成功后自动保存登录信息
- **Token 生成**: 生成模拟的 JWT token

## 文件结构

```
src/
├── services/
│   └── authService.ts          # 认证服务主文件
├── pages/
│   ├── VerifyPage.tsx          # 验证页面（已更新）
│   └── ChatPage.tsx            # 聊天页面（已更新）
└── constants/
    └── index.ts                # 常量定义
```

## 核心接口

### LoginInfo 接口
```typescript
export interface LoginInfo {
  guestId: string;        // 客人ID（固定为 "1"）
  roomNumber: string;     // 房间号
  loginTime: number;      // 登录时间戳
  token: string;          // 模拟的JWT token
}
```

### 主要方法
```typescript
// 获取当前登录信息
getLoginInfo(): LoginInfo | null

// 设置登录信息
setLoginInfo(roomNumber: string): LoginInfo

// 获取当前 guestId
getCurrentGuestId(): string

// 获取当前房间号
getCurrentRoomNumber(): string | null

// 检查是否已登录
isLoggedIn(): boolean

// 清除登录信息
clearLoginInfo(): void

// 模拟登录验证
mockLogin(verifyCode: string, roomNumber: string): Promise<boolean>
```

## 使用方式

### 1. 在 VerifyPage 中的使用
```typescript
import { authService } from '../services/authService';

// 验证成功后，使用 guestId 建立 WebSocket 连接
const guestId = authService.getCurrentGuestId();
await connectWebSocket(guestId);
```

### 2. 在 ChatPage 中的使用
```typescript
import { authService } from '../services/authService';

// 显示房间号
<h1>房间 {authService.getCurrentRoomNumber() || MOCK.roomNumber}</h1>

// 结束对话时清除登录信息
authService.clearLoginInfo();
```

## 存储机制

### localStorage 键值
- **键名**: `hotel_guest_login_info`
- **存储内容**: JSON 格式的 LoginInfo 对象
- **过期时间**: 24 小时（可配置）

### 数据持久化
- 页面刷新后保持登录状态
- 支持多标签页共享登录状态
- 自动清理过期的登录信息

## 配置说明

### 默认值
- **DEFAULT_GUEST_ID**: `"1"` (硬编码，符合用户要求)
- **STORAGE_KEY**: `"hotel_guest_login_info"`
- **TOKEN_EXPIRY**: 24 小时

### 自定义配置
可以通过修改 `AuthService` 类中的常量来调整配置：
```typescript
private readonly STORAGE_KEY = 'hotel_guest_login_info';
private readonly DEFAULT_GUEST_ID = '1';
```

## 扩展性

### 未来登录逻辑集成
当实现真实的登录逻辑时，只需要：
1. 修改 `mockLogin` 方法，调用真实的后端 API
2. 更新 `setLoginInfo` 方法，使用真实的用户信息
3. 保持现有的接口不变，确保其他组件无需修改

### 多用户支持
可以通过修改 `DEFAULT_GUEST_ID` 的逻辑来支持动态的 guestId 分配：
```typescript
// 示例：从登录响应中获取真实的 guestId
setLoginInfo(roomNumber: string, realGuestId?: string): LoginInfo {
  const guestId = realGuestId || this.DEFAULT_GUEST_ID;
  // ... 其余逻辑
}
```

## 注意事项

1. **安全性**: 当前实现仅用于开发测试，生产环境需要真实的后端认证
2. **数据验证**: 登录信息的验证逻辑目前是硬编码的，实际使用时需要后端验证
3. **错误处理**: 包含了基本的错误处理，但可以根据实际需求进一步优化
4. **性能**: 使用 localStorage 进行存储，适合小型应用，大型应用可能需要考虑其他存储方案

## 测试建议

1. **登录流程**: 测试验证码验证、登录信息存储
2. **状态保持**: 测试页面刷新后登录状态的保持
3. **WebSocket 连接**: 测试使用 guestId 建立连接
4. **登出流程**: 测试清除登录信息和状态重置
5. **多标签页**: 测试多个标签页之间的状态同步
