import { ProcessSpawn } from "@api/core/process-spawn";
import { loadUserProcesses } from "@api/data/file-loader";
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
  }

  get(name: string) {
    return this.processes.get(name);
  }

  getAll() {
    return Array.from(this.processes.values());
  }

  start(name: string) {
    const process = this.processes.get(name);

    if (!process) {
      throw new NoProcessFoundError(`Process ${name} not found`);
    }

    if (process.spawn.status === "killed" || process.spawn.status === "exited") {
      process.spawn = new ProcessSpawn(process);
    }

    if (process.spawn.status === "running") {
      throw new ProcessAlreadyRunningError(`Process ${name} already running`);
    }

    process.spawn.start();

    return process;
  }

  stop(name: string) {
    const process = this.processes.get(name);

    if (!process) {
      throw new NoProcessFoundError(`Process ${name} not found`);
    }

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
