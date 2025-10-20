import { spawn } from "node:child_process";
import { processesOrchestrator } from "@api/core/processes-orchestrator";
import { logger } from "@api/lib/logger";

export const executeCwdCommand = (processName: string, command: string) => {
  const process = processesOrchestrator.get(processName);
  logger.debug({ processName, command, cwd: process.cwd }, "Executing cwd command");
  spawn(command, [process.cwd], { detached: true }).unref();
};
