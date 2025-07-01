import type { DownstreamEvent } from "@fusebox/api/events";
import { createContext, useContext, useEffect, useRef } from "react";

export type WebSocketSubscribeCallback = (event: DownstreamEvent) => void;

export const WebSocketContext = createContext<{
  subscribe: (callback: WebSocketSubscribeCallback) => void;
  unsubscribe: (callback: WebSocketSubscribeCallback) => void;
}>({
  subscribe: () => {},
  unsubscribe: () => {},
});

export type WebsocketProviderProps = {
  children: React.ReactNode;
};

export const WebSocketProvider = ({ children }: WebsocketProviderProps) => {
  const socketRef = useRef<WebSocket | null>(null);
  const subscribers = useRef(new Set<WebSocketSubscribeCallback>());

  const subscribe = (callback: WebSocketSubscribeCallback) => {
    subscribers.current.add(callback);
  };

  const unsubscribe = (callback: WebSocketSubscribeCallback) => {
    subscribers.current.delete(callback);
  };

  useEffect(() => {
    socketRef.current = new WebSocket("/api/ws");

    socketRef.current.onopen = (event) => {
      console.log("WebSocket client opened", event);
    };

    socketRef.current.onclose = (event) => {
      console.log("WebSocket client closed", event);
    };

    socketRef.current.onmessage = (event) => {
      const message = JSON.parse(event.data) as DownstreamEvent;

      for (const callback of subscribers.current) {
        callback(message);
      }
    };

    return () => socketRef.current?.close();
  }, []);

  return (
    <WebSocketContext.Provider
      value={{
        subscribe,
        unsubscribe,
      }}
    >
      {children}
    </WebSocketContext.Provider>
  );
};

export const useWebSocket = () => {
  return useContext(WebSocketContext);
};
