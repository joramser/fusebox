import {
  NoProcessFoundError,
  ProcessAlreadyRunningError,
  processesOrchestrator,
} from "@api/core/processes-orchestrator";
import { processWebSocketListenerManager } from "@api/socket/process-websocket-manager";

import { HTTPException } from "hono/http-exception";

export const startProcess = (name: string) => {
  try {
    const process = processesOrchestrator.get(name);

    if (process.spawn.status === "init") {
      processWebSocketListenerManager.registerProcessSpawn(process.spawn);
    }

    processesOrchestrator.start(process);
  } catch (error) {
    if (error instanceof ProcessAlreadyRunningError) {
      throw new HTTPException(409, { message: error.message });
    }

    if (error instanceof NoProcessFoundError) {
      throw new HTTPException(404, { message: error.message });
    }

    throw error;
  }
};

export const stopProcess = (name: string) => {
  try {
    const process = processesOrchestrator.get(name);

    processesOrchestrator.stop(process);
  } catch (error) {
    if (error instanceof NoProcessFoundError) {
      throw new HTTPException(404, { message: error.message });
    }

    throw error;
  }
};

export const clearProcessOutput = (name: string) => {
  try {
    const process = processesOrchestrator.get(name);
    process.spawn.clearOutput();
  } catch (error) {
    if (error instanceof NoProcessFoundError) {
      throw new HTTPException(404, { message: error.message });
    }

    throw error;
  }
};
