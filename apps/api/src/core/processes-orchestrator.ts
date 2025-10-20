import { ProcessSpawn } from "@api/core/process-spawn";
import { loadUserProcesses } from "@api/data/file-loader";
import { logger } from "@api/lib/logger";
import type { ProcessSchema } from "@api/schemas/process.schema";
import type { ProcessConfigurationSchema } from "@api/schemas/process-configuration.schema";

/**
 * Represent a user process with a spawned process
 */
type RunningProcess = ProcessConfigurationSchema & {
  spawn: ProcessSpawn;
};

class ProcessesOrchestrator {
  private processes = new Map<string, RunningProcess>();

  async init() {
    const processesConfiguration = await loadUserProcesses();

    for (const processConfiguration of processesConfiguration) {
      const process: RunningProcess = {
        ...processConfiguration,
        spawn: new ProcessSpawn(processConfiguration),
      };

      this.processes.set(process.name, process);
    }

    logger.info(
      { processNames: Array.from(this.processes.keys()) },
      "Process orchestrator initialized"
    );
  }

  get(name: string) {
    const process = this.processes.get(name);

    if (!process) {
      logger.warn({ processName: name }, "Process not found");
      throw new NoProcessFoundError(`Process ${name} not found`);
    }

    return process;
  }

  getAll() {
    return Array.from(this.processes.values());
  }

  start(process: RunningProcess) {
    if (process.spawn.status === "running") {
      logger.warn({ processName: process.name }, "Process already running");
      throw new ProcessAlreadyRunningError(`Process ${process.name} already running`);
    }

    logger.debug({ processName: process.name }, "Starting process");
    process.spawn.start();

    return process;
  }

  stop(process: RunningProcess) {
    logger.debug({ processName: process.name }, "Stopping process");
    process.spawn.stop();

    return process;
  }

  clear() {
    for (const process of this.processes.values()) {
      if (process.spawn.status === "running") {
        process.spawn.stop();
      }
    }
  }

  serialize(): ProcessSchema[] {
    return this.getAll().map((process) => ({
      ...process,
      spawn: {
        status: process.spawn.status,
        output: process.spawn.output,
        pid: process.spawn.pid,
      },
    }));
  }
}

export class NoProcessFoundError extends Error {
  readonly _tag = "NoProcessFoundError";
}

export class ProcessAlreadyRunningError extends Error {
  readonly _tag = "ProcessAlreadyRunningError";
}

/** Processes orchestrator app singleton */
export const processesOrchestrator = new ProcessesOrchestrator();
