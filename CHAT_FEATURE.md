# 酒店客人聊天功能

## 功能概述

本项目实现了酒店客人与客服之间的实时聊天功能，支持文字消息的发送和接收。

## 主要功能

### 1. 消息发送
- 支持文字消息发送
- 实时显示发送状态
- 支持快捷菜单选择预设消息模板
- 发送时显示加载动画

### 2. 消息展示
- 动态加载历史消息
- 区分客人和客服消息（左侧/右侧显示）
- 显示消息发送时间
- 自动滚动到最新消息

### 3. 错误处理
- 网络错误提示
- 发送失败重试机制
- 友好的错误信息展示

## API接口

### 创建消息
- **接口**: `POST /chat-guest/create-message`
- **请求体**: 
  ```json
  {
    "content": "消息内容"
  }
  ```
- **响应**: 返回创建的消息对象

### 获取消息列表
- **接口**: `GET /chat-guest/message-list`
- **响应**: 返回消息列表数组

### 请求头
所有请求都需要包含：
```
X-Guest-Id: 1
```

## 技术实现

### 组件结构
- `ChatPage`: 主聊天页面
- `Message`: 单条消息组件
- `ChatInput`: 消息输入组件
- `ErrorMessage`: 错误提示组件
- `LoadingSpinner`: 加载动画组件

### 自定义Hook
- `useMessages`: 消息状态管理Hook

### 工具函数
- `formatTimestamp`: 时间戳格式化
- `getCurrentTimestamp`: 获取当前时间戳

## 消息类型

### 消息结构
```typescript
interface Message {
  id: number;
  content: string;
  message_type: number; // 0: 客人, 1: 客服
  content_type: string; // 'text'
  content_attributes: Record<string, any>;
  created_at: number; // 秒级时间戳
  conversation_id: number;
  sender: Sender;
}
```

### 发送方类型
- `message_type: 0` - 客人发送的消息（显示在右侧）
- `message_type: 1` - 客服发送的消息（显示在左侧）

## 使用说明

1. 页面加载时自动获取历史消息
2. 在输入框中输入消息内容
3. 点击发送按钮或按回车键发送消息
4. 可以使用快捷菜单选择预设消息模板
5. 发送的消息会立即显示在聊天界面

## 扩展功能

### 未来可扩展的消息类型
- 图片消息
- 语音消息
- 文件消息
- 表情消息

### 实时功能
- WebSocket连接实现实时消息推送
- 消息已读状态
- 在线状态显示
