import type { ProcessSpawn, ProcessSpawnSendEvent } from "@api/core/process-spawn";
import { processesOrchestrator } from "@api/core/processes-orchestrator";
import { socketManager } from "@api/socket/socket-manager";
import type { ServerWebSocket } from "bun";

/**
 * Listens to events from spawned processes and sends them to the client over WebSocket
 */
class ProcessWebSocketListenerManager {
  private spawnListeners = new Map<ServerWebSocket, (data: ProcessSpawnSendEvent) => void>();

  /** Only used by debug endpoint */
  getAll() {
    return Array.from(this.spawnListeners.values());
  }

  registerForAllSpawns(socket: ServerWebSocket) {
    for (const process of processesOrchestrator
      .getAll()
      .filter((process) => process.spawn.status === "running")) {
      this.registerSpawnListener(process.spawn, socket);
    }
  }

  registerForAllWebSockets(spawn: ProcessSpawn) {
    for (const socket of socketManager.getAll()) {
      this.registerSpawnListener(spawn, socket);
    }
  }

  unregisterForAllSpawns(socket: ServerWebSocket) {
    for (const process of processesOrchestrator.getAll()) {
      this.unregisterSpawnListener(process.spawn, socket);
    }
  }

  private registerSpawnListener(spawn: ProcessSpawn, socket: ServerWebSocket) {
    const listener = (data: ProcessSpawnSendEvent) => {
      socket.send(JSON.stringify(data));
    };

    spawn.on("send", listener);

    this.spawnListeners.set(socket, listener);
  }

  private unregisterSpawnListener(spawn: ProcessSpawn, socket: ServerWebSocket) {
    const listener = this.spawnListeners.get(socket);

    if (!listener) {
      return;
    }

    spawn.removeListener("send", listener);

    this.spawnListeners.delete(socket);
  }
}

export const processWebSocketListenerManager = new ProcessWebSocketListenerManager();
