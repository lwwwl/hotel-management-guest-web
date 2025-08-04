# 酒店客服系统 - 客人端

这是一个React项目，为酒店客人提供身份验证和客服聊天功能。

## 项目结构

```
src/
├── components/          # 可复用组件
│   ├── Message.tsx         # 消息组件
│   ├── ChatInput.tsx       # 聊天输入组件
│   ├── QuickServices.tsx   # 快捷服务组件
│   └── ServiceModal.tsx    # 服务请求模态框组件
├── hooks/              # 自定义Hooks
│   ├── useChat.ts          # 聊天相关逻辑
│   └── useVerify.ts        # 验证相关逻辑
├── pages/              # 页面组件
│   ├── VerifyPage.tsx      # 身份验证页面
│   ├── ChatPage.tsx        # 聊天页面
│   ├── ExpiredPage.tsx     # 会话过期页面
│   └── VerifyPremiumPage.tsx # 高级验证页面
├── constants/           # 常量定义
│   └── index.ts
├── types/              # TypeScript类型定义
│   └── index.ts
├── App.tsx             # 主应用组件
├── main.tsx            # 应用入口
└── index.css           # 全局样式
```

## 功能特性

### 身份验证页面 (`/verify`)
- 多语言支持（中文、英文、日文、韩文）
- 房间号验证
- 快捷服务菜单
- 服务请求模态框

### 聊天页面 (`/chat`)
- 实时消息显示
- 快捷菜单选择
- 消息发送功能
- 会话结束功能

### 高级验证页面 (`/verify-premium`)
- 高金额订单的额外验证
- 6位数字验证码

### 过期页面 (`/expired`)
- 会话过期提示
- 重新开始功能

## 技术栈

- React 19
- TypeScript
- Tailwind CSS
- React Router
- Unicons 图标库

## 开发

```bash
# 安装依赖
npm install

# 启动开发服务器
npm run dev

# 构建生产版本
npm run build
```

## 路由

- `/` - 重定向到 `/verify`
- `/verify` - 身份验证页面
- `/chat` - 聊天页面
- `/expired` - 会话过期页面
- `/verify-premium` - 高级验证页面

## 样式

项目使用Tailwind CSS进行样式设计，保持了与原始HTML原型完全一致的视觉效果。

## 模拟数据

项目包含完整的模拟数据，包括：
- 验证码列表
- 初始聊天消息
- 快捷菜单项
- 多语言文本

## 注意事项

- 目前使用模拟数据，未连接后端API
- 所有交互都是前端模拟
- 支持响应式设计
- 包含完整的TypeScript类型定义
