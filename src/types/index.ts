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
}

// WebSocket通知消息类型
export interface NotificationMessage {
  type: string; // 'message_created' | 'message_updated' | 'conversation_created' | 'conversation_updated' | 'conversation_resolved'
  data: Message | null; // 消息体，对于非消息类型可能为null
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