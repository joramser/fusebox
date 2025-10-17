import { type ChildProcess, spawn } from "node:child_process";
import { EventEmitter } from "node:events";
import type { LineCreatedEvent, ProcessErrorEvent, ProcessUpdatedEvent } from "@api/events";
import { logger } from "@api/lib/logger";
import type { ProcessOutputSchema, ProcessStatusSchema } from "@api/schemas/process.schema";
import type { ProcessConfigurationSchema } from "@api/schemas/process-configuration.schema";
import type { Logger } from "pino";

export type ProcessSpawnSendEvent = LineCreatedEvent | ProcessUpdatedEvent | ProcessErrorEvent;

/**
 * Max number of lines per process output for extra measure.
 */
const MAX_OUTPUT_LINES = 100000;

/**
 *
 */
export class ProcessSpawn extends EventEmitter<{
  send: [ProcessSpawnSendEvent];
}> {
  private spawn: ChildProcess | null = null;
  private logger: Logger;

  public pid: number | undefined;
  public status: ProcessStatusSchema = "init";
  public output: ProcessOutputSchema[] = [];

  private outputLinesCounter = 0;

  constructor(public processConfiguration: ProcessConfigurationSchema) {
    super();

    this.logger = logger.child({
      name: "process-spawn",
      processName: processConfiguration.name,
    });
  }

  get name() {
    return this.processConfiguration.name;
  }

  addLine(line: ProcessOutputSchema) {
    this.output.push(line);

    if (this.output.length > MAX_OUTPUT_LINES) {
      this.output.shift();
    }

    this.emit("send", {
      name: "v1.line-created",
      params: {
        processName: this.name,
        number: line.number,
        line: line.line,
      },
    });
  }

  start() {
    if (this.spawn) {
      this.spawn.removeAllListeners();
      this.clearOutput();
    }

    this.spawn = spawn(`${this.processConfiguration.command} ${this.processConfiguration.args}`, {
      cwd: this.processConfiguration.cwd,
      detached: false,
      shell: true,
      env: {
        FORCE_COLOR: "1",
        ...process.env,
        ...this.processConfiguration.env,
      },
    });

    this.spawn.on("spawn", () => {
      this.logger.info({ childPid: this.spawn?.pid }, "Process started");

      this.status = "running";
      this.pid = this.spawn?.pid;

      this.emit("send", {
        name: "v1.process-updated",
        params: {
          processName: this.name,
          status: this.status,
          pid: this.pid,
          output: this.output,
        },
      });
    });

    this.spawn.stdout?.on("data", (data) => {
      const newLine = {
        line: data.toString(),
        number: ++this.outputLinesCounter,
      };

      this.addLine(newLine);
    });

    this.spawn.stderr?.on("data", (data) => {
      const newLine = {
        line: data.toString(),
        number: ++this.outputLinesCounter,
      };

      this.addLine(newLine);
    });

    this.spawn.on("close", (code, signal) => {
      const newLine = {
        line: `Process closed${code ? ` with code ${code}` : ""}`,
        number: ++this.outputLinesCounter,
      };

      if (signal === "SIGTERM") {
        this.status = "stopped";
      } else if (code === 0) {
        this.status = "exited";
      } else {
        this.status = "killed";
      }

      this.addLine(newLine);

      this.logger.info(
        {
          childPid: this.spawn?.pid,
          code,
          signal,
        },
        "Process closed",
      );

      this.emit("send", {
        name: "v1.process-updated",
        params: {
          processName: this.name,
          status: this.status,
        },
      });
    });

    this.spawn.on("error", (error) => {
      this.logger.error(error, "Process error");

      this.emit("send", {
        name: "v1.process-error",
        params: {
          processName: this.name,
          message: error.message,
        },
      });
    });
  }

  stop() {
    if (!this.spawn) {
      throw new Error("Spawn process not started");
    }

    this.spawn.kill("SIGTERM");
  }

  clearOutput() {
    this.output = [];
    this.outputLinesCounter = 0;
    this.emit("send", {
      name: "v1.process-updated",
      params: {
        processName: this.name,
        output: this.output,
      },
    });
  }
}
