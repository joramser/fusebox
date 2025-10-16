import { processWebSocketListenerManager } from "@api/socket/process-websocket-manager";
import { socketManager } from "@api/socket/socket-manager";
import type { ServerWebSocket } from "bun";

export const openSocket = (socket: ServerWebSocket) => {
  socketManager.register(socket);
  processWebSocketListenerManager.registerSocket(socket);
};

export const closeSocket = (socket: ServerWebSocket) => {
  socketManager.close(socket);
  processWebSocketListenerManager.unregisterSocket(socket);
};
