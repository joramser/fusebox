import { processSocketListenerManager } from "@api/socket/process-socket-listener-manager";
import { socketManager } from "@api/socket/socket-manager";
import type { ServerWebSocket } from "bun";

export const openSocket = (socket: ServerWebSocket) => {
  socketManager.register(socket);
  processSocketListenerManager.registerSocket(socket);
};

export const closeSocket = (socket: ServerWebSocket) => {
  socketManager.close(socket);
  processSocketListenerManager.unregisterSocket(socket);
};
