import { processesOrchestrator } from "@api/core/processes-orchestrator";

import { processWebSocketListenerManager } from "@api/socket/process-websocket-manager";
import { socketManager } from "@api/socket/socket-manager";
import { Hono } from "hono";

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
