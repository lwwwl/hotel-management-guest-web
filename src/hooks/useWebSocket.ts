import { useState, useEffect, useRef, useCallback } from 'react';
import { getGuestWebSocketConnection } from '../api/websocket';
import type { NotificationMessage, WebSocketMessage } from '../types';

// WebSocket连接状态
export interface WebSocketState {
  isConnected: boolean;
  isConnecting: boolean;
  connectionError: string | null;
  lastMessage: WebSocketMessage | null;
}

// WebSocket Hook返回值
export interface UseWebSocketReturn extends WebSocketState {
  connect: (guestId: string) => Promise<void>;
  disconnect: () => void;
  sendMessage: (message: string) => void;
  reconnect: () => Promise<void>;
  onMessageReceived?: (notification: NotificationMessage) => void;
}

export const useWebSocket = (onMessageReceived?: (notification: NotificationMessage) => void): UseWebSocketReturn => {
  const [state, setState] = useState<WebSocketState>({
    isConnected: false,
    isConnecting: false,
    connectionError: null,
    lastMessage: null,
  });

  const wsRef = useRef<WebSocket | null>(null);
  const guestIdRef = useRef<string | null>(null);
  const reconnectTimeoutRef = useRef<number | null>(null);
  const heartbeatIntervalRef = useRef<number | null>(null);
  const messageCallbackRef = useRef(onMessageReceived);

  // 更新消息回调函数
  useEffect(() => {
    messageCallbackRef.current = onMessageReceived;
  }, [onMessageReceived]);

  // 清理资源
  const cleanup = useCallback(() => {
    if (heartbeatIntervalRef.current) {
      clearInterval(heartbeatIntervalRef.current);
      heartbeatIntervalRef.current = null;
    }
    if (reconnectTimeoutRef.current) {
      clearTimeout(reconnectTimeoutRef.current);
      reconnectTimeoutRef.current = null;
    }
  }, []);

  // 建立WebSocket连接
  const connect = useCallback(async (guestId: string) => {
    if (state.isConnecting || state.isConnected) {
      return;
    }

    try {
      setState(prev => ({ ...prev, isConnecting: true, connectionError: null }));
      
      // 获取WebSocket连接信息
      const connectionInfo = await getGuestWebSocketConnection(guestId);
      
      if (!connectionInfo.success) {
        throw new Error(connectionInfo.message || '获取连接信息失败');
      }

      // 建立WebSocket连接
      const ws = new WebSocket(connectionInfo.wsUrl);
      wsRef.current = ws;
      guestIdRef.current = guestId;

      // 连接建立
      ws.onopen = () => {
        console.log('WebSocket连接已建立');
        setState(prev => ({ 
          ...prev, 
          isConnected: true, 
          isConnecting: false, 
          connectionError: null 
        }));

        // 启动心跳
        startHeartbeat();
      };

      // 接收消息
      ws.onmessage = (event) => {
        try {
          const data = event.data;
          
          // 检查是否是ping/pong消息（纯文本）
          if (data === 'ping' || data === 'pong') {
            console.log('收到心跳消息:', data);
            if (data === 'pong') {
              // 处理pong响应
              handleMessage({ 
                type: 'pong', 
                data: null, 
                timestamp: new Date().toISOString() 
              });
            }
            return;
          }
          
          // 尝试解析JSON消息
          const message = JSON.parse(data);
          setState(prev => ({ ...prev, lastMessage: message }));
          
          // 处理不同类型的消息
          handleMessage(message);
        } catch (error) {
          console.error('解析WebSocket消息失败:', error);
          console.log('原始消息数据:', event.data);
        }
      };

      // 连接关闭
      ws.onclose = (event) => {
        console.log('WebSocket连接已关闭:', event.code, event.reason);
        setState(prev => ({ 
          ...prev, 
          isConnected: false, 
          isConnecting: false 
        }));
        
        cleanup();
        
        // 如果不是主动关闭，则安排重连
        if (event.code !== 1000) {
          scheduleReconnect();
        }
      };

      // 连接错误
      ws.onerror = (error) => {
        console.error('WebSocket连接错误:', error);
        setState(prev => ({ 
          ...prev, 
          connectionError: 'WebSocket连接错误',
          isConnecting: false 
        }));
      };

    } catch (error) {
      console.error('建立WebSocket连接失败:', error);
      setState(prev => ({ 
        ...prev, 
        isConnecting: false, 
        connectionError: error instanceof Error ? error.message : '连接失败' 
      }));
    }
  }, [state.isConnecting, state.isConnected, cleanup]);

  // 断开连接
  const disconnect = useCallback(() => {
    if (wsRef.current) {
      wsRef.current.close(1000, '用户主动断开');
      wsRef.current = null;
    }
    guestIdRef.current = null;
    cleanup();
    
    setState(prev => ({ 
      ...prev, 
      isConnected: false, 
      isConnecting: false,
      connectionError: null 
    }));
  }, [cleanup]);

  // 发送消息
  const sendMessage = useCallback((message: string) => {
    if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
      wsRef.current.send(message);
    } else {
      console.warn('WebSocket未连接，无法发送消息');
    }
  }, []);

  // 重连
  const reconnect = useCallback(async () => {
    if (guestIdRef.current) {
      disconnect();
      await connect(guestIdRef.current);
    }
  }, [connect, disconnect]);

  // 启动心跳
  const startHeartbeat = useCallback(() => {
    heartbeatIntervalRef.current = setInterval(() => {
      if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
        wsRef.current.send('ping');
      }
    }, 30000); // 30秒发送一次心跳
  }, []);

  // 处理接收到的消息
  const handleMessage = useCallback((message: WebSocketMessage) => {
    switch (message.type) {
      case 'message_created':
        console.log('收到创建消息通知:', message);
        // 调用回调函数处理消息
        if (messageCallbackRef.current) {
          messageCallbackRef.current(message as NotificationMessage);
        }
        break;
      case 'pong':
        console.log('收到心跳响应');
        break;
      default:
        console.log('收到未知类型消息:', message);
    }
  }, []);

  // 安排重连
  const scheduleReconnect = useCallback(() => {
    if (reconnectTimeoutRef.current) {
      clearTimeout(reconnectTimeoutRef.current);
    }
    
    reconnectTimeoutRef.current = setTimeout(() => {
      if (guestIdRef.current) {
        console.log('尝试重新连接...');
        connect(guestIdRef.current);
      }
    }, 5000); // 5秒后重连
  }, [connect]);

  // 组件卸载时清理
  useEffect(() => {
    return () => {
      disconnect();
    };
  }, [disconnect]);

  return {
    ...state,
    connect,
    disconnect,
    sendMessage,
    reconnect,
  };
};
