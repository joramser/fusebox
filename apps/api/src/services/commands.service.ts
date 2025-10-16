import { spawn } from "node:child_process";
import { NoProcessFoundError, processesOrchestrator } from "@api/core/processes-orchestrator";
import { HTTPException } from "hono/http-exception";

export const executeCwdCommand = (processName: string, command: string) => {
  try {
    const process = processesOrchestrator.get(processName);
    spawn(command, [process.cwd], { detached: true }).unref();
  } catch (error) {
    if (error instanceof NoProcessFoundError) {
      throw new HTTPException(404, { message: error.message });
    }
  }
};
