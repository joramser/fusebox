import { spawn } from "node:child_process";
import { processesOrchestrator } from "@api/core/processes-orchestrator";

export const executeCwdCommand = (processName: string, command: string) => {
  const process = processesOrchestrator.get(processName);
  spawn(command, [process.cwd], { detached: true }).unref();
};
