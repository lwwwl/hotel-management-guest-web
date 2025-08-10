# WebSocket消息处理功能说明

## 概述

本功能实现了客人端WebSocket消息的实时处理，支持接收和处理来自后端的实时消息通知。

## 支持的消息类型

根据后端`NotificationService.java`的实现，客人端目前支持处理以下两种消息类型：

### 1. message_created - 新消息通知
- **触发时机**: 当有新消息创建时
- **处理逻辑**: 将新消息添加到消息列表中
- **UI更新**: 在会话界面中显示新消息

### 2. message_updated - 消息更新通知
- **触发时机**: 当已有消息被更新时
- **处理逻辑**: 根据消息ID查找并更新现有消息
- **UI更新**: 更新会话界面中的对应消息

## 消息格式

### NotificationMessage结构
```typescript
interface NotificationMessage {
  type: string;           // 消息类型: 'message_created' | 'message_updated'
  data: Message | null;   // 消息体数据
  timestamp: string;      // 时间戳
  conversationId: number; // 会话ID
}
```

### Message结构
```typescript
interface Message {
  id: number;                    // 消息ID
  content: string;               // 消息内容
  message_type: number;          // 消息类型: 0(guest) | 1(agent)
  content_type: string;          // 内容类型: 'text'
  content_attributes: Record<string, any>; // 内容属性
  created_at: number;            // 创建时间戳(秒)
  conversation_id: number;       // 会话ID
  sender: Sender;                // 发送者信息
}
```

## 技术实现

### 1. WebSocket连接管理
- **连接建立**: 在`VerifyPage`验证成功后自动建立WebSocket连接
- **连接状态**: 实时显示连接状态（绿色/红色指示器）
- **自动重连**: 连接断开时自动尝试重连
- **心跳机制**: 30秒间隔发送心跳包保持连接

### 2. 消息处理架构
```
WebSocket连接 → 消息接收 → 消息解析 → 类型判断 → 业务处理 → UI更新
```

### 3. 消息处理器注册机制
- **多处理器支持**: 支持多个组件注册消息处理器
- **自动清理**: 组件卸载时自动取消注册
- **错误隔离**: 单个处理器错误不影响其他处理器

## 核心文件

### 类型定义
- `src/types/index.ts` - 定义`NotificationMessage`和`Message`接口

### WebSocket管理
- `src/hooks/useWebSocket.ts` - WebSocket连接和消息处理核心逻辑
- `src/contexts/WebSocketContext.tsx` - WebSocket上下文，提供全局消息处理

### 消息管理
- `src/hooks/useMessages.ts` - 消息状态管理，提供`addMessage`和`updateMessage`方法

### 页面组件
- `src/pages/ChatPage.tsx` - 聊天页面，注册消息处理器并更新UI

## 使用流程

### 1. 连接建立
```typescript
// 在VerifyPage中验证成功后
const guestId = authService.getCurrentGuestId();
await connectWebSocket(guestId);
```

### 2. 消息处理器注册
```typescript
// 在ChatPage中
const handleWebSocketMessage = useCallback((notification: NotificationMessage) => {
  switch (notification.type) {
    case 'message_created':
      addMessage(notification.data);
      break;
    case 'message_updated':
      updateMessage(notification.data);
      break;
  }
}, [addMessage, updateMessage]);

useEffect(() => {
  const unregister = registerMessageHandler(handleWebSocketMessage);
  return unregister;
}, [registerMessageHandler, handleWebSocketMessage]);
```

### 3. 消息处理
```typescript
// 新消息处理
const addMessage = useCallback((message: Message) => {
  setMessages(prev => [...prev, message]);
}, []);

// 消息更新处理
const updateMessage = useCallback((updatedMessage: Message) => {
  setMessages(prev => 
    prev.map(message => 
      message.id === updatedMessage.id ? updatedMessage : message
    )
  );
}, []);
```

## 错误处理

### 1. 连接错误
- 显示连接状态指示器
- 自动重连机制
- 错误信息提示

### 2. 消息解析错误
- 日志记录错误信息
- 不影响其他消息处理
- 优雅降级

### 3. 处理器错误
- 单个处理器错误隔离
- 错误日志记录
- 不影响其他处理器

## 调试信息

### 控制台日志
- WebSocket连接状态变化
- 消息接收和解析过程
- 消息处理结果
- 错误信息

### 示例日志
```
WebSocket连接已建立
收到通知: {type: "notification", data: {...}}
解析的通知消息: {type: "message_created", data: {...}}
处理新消息: {id: 123, content: "Hello", ...}
```

## 扩展性

### 1. 新增消息类型
在`handleWebSocketMessage`中添加新的case分支：
```typescript
case 'new_message_type':
  // 处理新消息类型
  break;
```

### 2. 新增消息处理器
在需要处理消息的组件中注册处理器：
```typescript
const unregister = registerMessageHandler(handleMessage);
```

### 3. 消息过滤
可以根据`conversationId`或其他条件过滤消息：
```typescript
if (notification.conversationId === currentConversationId) {
  // 处理消息
}
```

## 注意事项

1. **消息顺序**: 确保消息按时间顺序显示
2. **重复消息**: 避免重复添加相同ID的消息
3. **性能优化**: 大量消息时考虑虚拟滚动
4. **内存管理**: 及时清理不需要的消息处理器
5. **网络异常**: 处理网络断开和重连场景
