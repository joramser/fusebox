import { processesOrchestrator } from "@api/core/processes-orchestrator";
import { logger } from "@api/lib/logger";
import { processSocketListenerManager } from "@api/socket/process-socket-listener-manager";

export const startProcess = (name: string) => {
  const process = processesOrchestrator.get(name);

  if (process.spawn.status === "init") {
    processSocketListenerManager.registerProcessSpawn(process.spawn);
  }

  processesOrchestrator.start(process);
  logger.debug({ processName: name }, "Process started successfully");
};

export const stopProcess = (name: string) => {
  const process = processesOrchestrator.get(name);
  processesOrchestrator.stop(process);
  logger.debug({ processName: name }, "Process stopped successfully");
};

export const clearProcessOutput = (name: string) => {
  const process = processesOrchestrator.get(name);
  process.spawn.clearOutput();
  logger.debug({ processName: name }, "Process output cleared");
};
