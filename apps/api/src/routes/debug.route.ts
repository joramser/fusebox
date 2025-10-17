import { processesOrchestrator } from "@api/core/processes-orchestrator";

import { processSocketListenerManager } from "@api/socket/process-socket-listener-manager";
import { socketManager } from "@api/socket/socket-manager";
import { Hono } from "hono";

const debug = new Hono();

debug.get("/", (ctx) => {
  const data = {
    socketListeners: processSocketListenerManager.getAll().length,
    spawnedProcesses: processesOrchestrator.getAll().length,
    sockets: socketManager.getAll().length,
  };

  return ctx.json(data);
});

export { debug };
