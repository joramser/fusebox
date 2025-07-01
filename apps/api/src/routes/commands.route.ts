import { spawn } from "node:child_process";
import { processesOrchestrator } from "@api/core/processes-orchestrator";
import { Hono } from "hono";
import { HTTPException } from "hono/http-exception";

const commands = new Hono()
  .post("/:name/open-folder", (ctx) => {
    const { name } = ctx.req.param();

    const process = processesOrchestrator.get(name);

    if (!process) {
      throw new HTTPException(404, { message: "Process not found" });
    }

    spawn("open", [process.cwd], { detached: true }).unref();

    return ctx.json({ message: "Folder opened" }, 202);
  })
  .post("/:name/open-ide", async (ctx) => {
    const { name } = ctx.req.param();

    const process = processesOrchestrator.get(name);

    if (!process) {
      throw new HTTPException(404, { message: "Process not found" });
    }

    spawn("code", [process.cwd], { detached: true }).unref();

    return ctx.json({ message: "IDE opened" }, 202);
  });

export { commands };
