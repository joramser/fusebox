import type { ServerWebSocket } from "bun";

class SocketManager {
  private connections = new Set<ServerWebSocket>();

  getAll() {
    return Array.from(this.connections);
  }

  register(socket: ServerWebSocket) {
    this.connections.add(socket);
  }

  close(socket: ServerWebSocket) {
    this.connections.delete(socket);
  }
}

export const socketManager = new SocketManager();
