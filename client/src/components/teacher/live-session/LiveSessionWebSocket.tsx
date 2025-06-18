import { useEffect, useRef, useState } from "react";
import { WebSocketMessage } from "./LiveSessionTypes";

interface LiveSessionWebSocketProps {
  sessionId: string;
  onMessage: (message: WebSocketMessage) => void;
  onConnectionChange: (connected: boolean) => void;
}

export function useWebSocketConnection({ sessionId, onMessage, onConnectionChange }: LiveSessionWebSocketProps) {
  const [ws, setWs] = useState<WebSocket | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const wsRef = useRef<WebSocket | null>(null);

  useEffect(() => {
    const protocol = window.location.protocol === "https:" ? "wss:" : "ws:";
    const wsUrl = `${protocol}//${window.location.host}/ws/live-sessions`;
    
    const websocket = new WebSocket(wsUrl);
    wsRef.current = websocket;
    
    websocket.onopen = () => {
      console.log('Connected to live session WebSocket');
      setIsConnected(true);
      setWs(websocket);
      onConnectionChange(true);
      
      // Register as teacher device
      websocket.send(JSON.stringify({
        type: 'register',
        sessionId,
        userId: 'current_user_id',
        deviceId: `teacher_${Date.now()}`,
        deviceInfo: {
          type: 'desktop',
          platform: navigator.platform,
          browser: navigator.userAgent,
          capabilities: {
            camera: true,
            microphone: true,
            screenShare: true,
            remoteControl: true
          }
        },
        tenantId: 'current_tenant_id'
      }));
    };

    websocket.onmessage = (event) => {
      const data = JSON.parse(event.data);
      onMessage(data);
    };

    websocket.onclose = () => {
      console.log('Disconnected from live session WebSocket');
      setIsConnected(false);
      setWs(null);
      onConnectionChange(false);
    };

    websocket.onerror = (error) => {
      console.error('WebSocket error:', error);
    };

    return () => {
      if (wsRef.current) {
        wsRef.current.close();
      }
    };
  }, [sessionId, onMessage, onConnectionChange]);

  const sendMessage = (message: any) => {
    if (ws && ws.readyState === WebSocket.OPEN) {
      ws.send(JSON.stringify({
        ...message,
        sessionId,
        timestamp: new Date().toISOString()
      }));
    }
  };

  return {
    ws,
    isConnected,
    sendMessage
  };
}