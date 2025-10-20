import type { UpstreamEvent } from "@api/events";
import { logger } from "@api/lib/logger";
import { executeCwdCommand } from "@api/services/commands.service";
import { clearProcessOutput, startProcess, stopProcess } from "@api/services/process.service";

export const upstreamEventMapper = (event: UpstreamEvent) => {
  const processName = event.params.processName;

  logger.info({ event: event.name, processName }, "Upstream event received");

  switch (event.name) {
    case "v1.start-process":
      startProcess(processName);
      break;

    case "v1.stop-process":
      stopProcess(processName);
      break;

    case "v1.clear-process-output":
      clearProcessOutput(processName);
      break;

    case "v1.open-folder-command":
      executeCwdCommand(processName, "open");
      break;

    case "v1.open-ide-command":
      executeCwdCommand(processName, "code");
      break;

    default: {
      logger.error({ event }, `Unhandled event type`);
    }
  }
};
