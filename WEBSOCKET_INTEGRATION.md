# WebSocket集成说明

## 概述

客人端Web应用已集成WebSocket功能，支持实时通信和状态同步。WebSocket连接在用户验证成功后自动建立，并在整个应用生命周期中保持连接。

## 功能特性

### 1. 自动连接管理
- **验证后连接**：用户在验证页面验证成功后自动建立WebSocket连接
- **全局状态**：通过React Context在整个应用中共享WebSocket连接状态
- **自动重连**：连接断开后自动尝试重连（5秒间隔）

### 2. 连接状态监控
- **实时状态**：在聊天页面显示WebSocket连接状态指示器
- **错误处理**：显示连接错误信息，帮助用户了解连接状态
- **心跳保活**：30秒发送一次心跳包，保持连接活跃

### 3. 消息处理
- **消息接收**：自动接收和处理WebSocket消息
- **消息类型**：支持通知、心跳响应等多种消息类型
- **全局通知**：可以触发全局通知系统

## 技术架构

### 文件结构
```
src/
├── api/
│   └── websocket.ts          # WebSocket API接口
├── hooks/
│   └── useWebSocket.ts       # WebSocket管理Hook
├── contexts/
│   └── WebSocketContext.tsx  # 全局WebSocket上下文
├── pages/
│   ├── VerifyPage.tsx        # 验证页面（建立连接）
│   └── ChatPage.tsx          # 聊天页面（显示状态）
└── App.tsx                   # 应用入口（提供上下文）
```

### 核心组件

#### 1. WebSocket API (`api/websocket.ts`)
- 提供与后端WebSocket服务的HTTP API接口
- 支持获取连接信息、检查状态、获取统计等操作
- 可配置API基础URL

#### 2. WebSocket Hook (`hooks/useWebSocket.ts`)
- 管理WebSocket连接的生命周期
- 处理连接、断开、重连、心跳等逻辑
- 提供连接状态和错误信息

#### 3. WebSocket Context (`contexts/WebSocketContext.tsx`)
- 全局WebSocket状态管理
- 通过React Context API在整个应用中共享状态
- 提供统一的WebSocket操作接口

## 使用方式

### 1. 在组件中使用WebSocket状态

```tsx
import { useWebSocketContext } from '../contexts/WebSocketContext';

const MyComponent = () => {
  const { isConnected, connectionError, sendMessage } = useWebSocketContext();
  
  return (
    <div>
      <p>连接状态: {isConnected ? '已连接' : '未连接'}</p>
      {connectionError && <p>错误: {connectionError}</p>}
      <button onClick={() => sendMessage('hello')}>发送消息</button>
    </div>
  );
};
```

### 2. 手动建立连接

```tsx
import { useWebSocketContext } from '../contexts/WebSocketContext';

const ConnectButton = () => {
  const { connect, isConnected } = useWebSocketContext();
  
  const handleConnect = async () => {
    try {
      await connect('room123');
      console.log('连接成功');
    } catch (error) {
      console.error('连接失败:', error);
    }
  };
  
  return (
    <button onClick={handleConnect} disabled={isConnected}>
      {isConnected ? '已连接' : '建立连接'}
    </button>
  );
};
```

## 配置说明

### 环境变量

创建 `.env` 文件并配置以下变量：

```bash
# WebSocket API配置
VITE_WEBSOCKET_API_URL=http://localhost:7766

# 其他配置
VITE_APP_TITLE=Hotel Guest Web
```

### 默认配置

如果不配置环境变量，系统将使用以下默认值：
- WebSocket API URL: `http://localhost:7766`
- 心跳间隔: 30秒
- 重连间隔: 5秒

## 消息格式

### 发送消息
```typescript
// 发送文本消息
sendMessage('Hello World');

// 发送心跳
sendMessage('ping');
```

### 接收消息
```typescript
interface WebSocketMessage {
  type: string;        // 消息类型
  data: any;          // 消息数据
  timestamp: string;  // 时间戳
}

// 消息类型示例
{
  type: 'notification',
  data: { title: '新消息', content: '您有一条新消息' },
  timestamp: '2024-01-01T12:00:00'
}
```

## 错误处理

### 连接错误
- 网络错误：自动重试连接
- 认证错误：显示错误信息
- 服务器错误：等待重连

### 消息错误
- 解析错误：记录日志，忽略消息
- 发送错误：记录日志，保持连接

## 性能优化

### 1. 连接复用
- 单个WebSocket连接在整个应用中共享
- 避免重复建立连接

### 2. 心跳优化
- 30秒心跳间隔，平衡性能和连接稳定性
- 自动检测连接状态

### 3. 重连策略
- 指数退避重连，避免频繁重连
- 最大重连次数限制

## 调试和监控

### 控制台日志
- 连接状态变化
- 消息收发记录
- 错误信息详情

### 连接状态指示器
- 绿色圆点：已连接
- 红色圆点：未连接
- 悬停显示详细状态

## 注意事项

1. **连接时机**：WebSocket连接在验证成功后建立，确保用户身份已确认
2. **错误容错**：即使WebSocket连接失败，用户仍可正常使用其他功能
3. **资源清理**：组件卸载时自动清理WebSocket连接
4. **状态同步**：所有页面共享相同的WebSocket连接状态
5. **网络适配**：支持网络切换和断线重连

## 扩展功能

### 1. 消息队列
- 离线消息缓存
- 消息发送重试
- 消息优先级排序

### 2. 多房间支持
- 支持同时连接多个房间
- 房间间消息隔离
- 房间状态同步

### 3. 推送通知
- 浏览器推送通知
- 声音提醒
- 桌面通知

## 故障排除

### 常见问题

1. **连接失败**
   - 检查后端服务是否启动
   - 确认API URL配置正确
   - 检查网络连接

2. **连接断开频繁**
   - 检查网络稳定性
   - 确认心跳配置
   - 查看后端日志

3. **消息丢失**
   - 检查消息格式
   - 确认连接状态
   - 查看错误日志

### 调试工具

- 浏览器开发者工具
- WebSocket连接状态
- 网络请求监控
- 控制台日志
