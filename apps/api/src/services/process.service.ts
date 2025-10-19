import { processesOrchestrator } from "@api/core/processes-orchestrator";
import { processSocketListenerManager } from "@api/socket/process-socket-listener-manager";

export const startProcess = (name: string) => {
  const process = processesOrchestrator.get(name);

  if (process.spawn.status === "init") {
    processSocketListenerManager.registerProcessSpawn(process.spawn);
  }

  processesOrchestrator.start(process);
};

export const stopProcess = (name: string) => {
  const process = processesOrchestrator.get(name);
  processesOrchestrator.stop(process);
};

export const clearProcessOutput = (name: string) => {
  const process = processesOrchestrator.get(name);
  process.spawn.clearOutput();
};
