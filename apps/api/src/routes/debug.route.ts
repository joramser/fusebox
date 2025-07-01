import { Hono } from "hono";

import { processWebSocketListenerManager } from "@api/socket/process-websocket-manager";
import { processesOrchestrator } from "@api/core/processes-orchestrator";
import { socketManager } from "@api/socket/socket-manager";

const debug = new Hono();

debug.get("/", (ctx) => {
  const data = {
    socketEvents: processWebSocketListenerManager.getAll().length,
    spawnedProcesses: processesOrchestrator.getAll().length,
    sockets: socketManager.getAll().length,
  };

  return ctx.json(data);
});

export { debug };
