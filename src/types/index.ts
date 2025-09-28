export interface Sender {
  id: number;
  name: string;
  available_name?: string;
  avatar_url?: string;
  type: 'user' | 'contact';
  availability_status?: string | null;
  thumbnail?: string;
  additional_attributes?: {
    age?: number;
    type?: string;
    roomId?: number;
    roomName?: string;
    leaveTime?: number;
    checkInTime?: number;
  };
  custom_attributes?: Record<string, any>;
  email?: string | null;
  identifier?: string;
  phone_number?: string | null;
  blocked?: boolean;
}

export interface Message {
  id: number;
  content: string;
  message_type: number; // 0: guest, 1: agent
  content_type: string; // 'text' for now
  content_attributes: Record<string, any>;
  created_at: number; // timestamp in seconds
  conversation_id: number;
  sender: Sender;
  translation?: string;
  translationLoading?: boolean;
  translationError?: boolean;
}

// WebSocket通知消息类型
export interface NotificationMessage {
  type: string; // 'message_created' | 'message_updated' | 'conversation_created' | 'conversation_updated' | 'conversation_resolved'
  data: string | null; // 消息体，JSON字符串格式，对于非消息类型可能为null
  timestamp: string;
  conversationId: number;
}

// WebSocket消息类型
export interface WebSocketMessage {
  type: string;
  data: any;
  timestamp: string;
}

export interface MenuItem {
  id: string;
  label: string;
  icon: string;
  template: string;
}

export interface QuickService {
  id: number;
  name: string;
  icon: string;
  description: string;
}

export interface LanguageTexts {
  welcome: string;
  roomNumber: string;
  verifyLabel: string;
  verifyPlaceholder: string;
  verifyButton: string;
  verifying: string;
  quickServices: string;
  serviceNote: string;
  helpText: string;
  serviceRequest: string;
  additionalNotes: string;
  serviceNotePlaceholder: string;
  serviceInfo: string;
  cancel: string;
  confirm: string;
  verifyFailed: string;
  networkError: string;
  verifySuccess: string;
  serviceConfirmed: string;
}

// 翻译相关类型
export type LanguageCode = 'zh_CN' | 'en_US' | 'ja_JP';

export interface LanguageOption {
  code: LanguageCode;
  name: string;
  flag: string;
}

export interface MessageContentInfo {
  messageId: number;
  content: string;
}

export interface TranslateRequest {
  conversationId: number;
  messages: MessageContentInfo[];
  language: LanguageCode;
}

export interface TranslateResultInfo {
  messageId: number;
  result: string;
}

export interface TranslateResponse {
  timestamp: number;
  statusCode: number;
  message: string;
  data: TranslateResultInfo[];
  error?: string;
}

export interface QuickMenuItem {
  id: number;
  icon: string;
  content: string; // JSON string
  sortOrder: number;
  createTime: string;
  updateTime: string;
}

// 解析后的快捷菜单内容
export interface ParsedQuickMenuContent {
  name: {
    zh: string;
    en: string;
    ja: string;
  };
  message: {
    zh: string;
    en: string;
    ja: string;
  };
} 