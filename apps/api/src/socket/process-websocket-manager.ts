import type { ProcessSpawn, ProcessSpawnSendEvent } from "@api/core/process-spawn";
import { processesOrchestrator } from "@api/core/processes-orchestrator";
import type { DownstreamEvent } from "@api/events";
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

  registerSocket(socket: ServerWebSocket) {
    for (const process of processesOrchestrator
      .getAll()
      .filter((process) => process.spawn.status === "running")) {
      this.registerSpawnListener(process.spawn, socket);
    }

    this.sendEvent(socket, {
      name: "v1.app-loaded",
      params: {
        processes: processesOrchestrator.serialize(),
      },
    });
  }

  registerProcessSpawn(spawn: ProcessSpawn) {
    for (const socket of socketManager.getAll()) {
      this.registerSpawnListener(spawn, socket);
    }
  }

  unregisterSocket(socket: ServerWebSocket) {
    for (const process of processesOrchestrator.getAll()) {
      this.unregisterSpawnListener(process.spawn, socket);
    }
    this.spawnListeners.delete(socket);
  }

  private registerSpawnListener(spawn: ProcessSpawn, socket: ServerWebSocket) {
    let listener = this.spawnListeners.get(socket);

    if (!listener) {
      listener = (event: ProcessSpawnSendEvent) => {
        this.sendEvent(socket, event);
      };
      this.spawnListeners.set(socket, listener);
    }

    spawn.on("send", listener);
  }

  private unregisterSpawnListener(spawn: ProcessSpawn, socket: ServerWebSocket) {
    const listener = this.spawnListeners.get(socket);

    if (!listener) {
      return;
    }

    spawn.removeListener("send", listener);
  }

  private sendEvent(socket: ServerWebSocket, event: DownstreamEvent) {
    if (socket.readyState === 1) {
      socket.send(JSON.stringify(event));
    }
  }
}

export const processWebSocketListenerManager = new ProcessWebSocketListenerManager();
