import {
  clearProcessOutput,
  getProcesses,
  startProcess,
  stopProcess,
} from "@api/services/process.service";

import { Hono } from "hono";

// TODO: Remove when upstream events are implemented
const processes = new Hono()
  .get("/", (ctx) => {
    return ctx.json(getProcesses());
  })
  .post("/:name/start", (ctx) => {
    const name = ctx.req.param("name");

    startProcess(name);

    return ctx.json({ message: `Process "${name}" started` });
  })
  .post("/:name/stop", (ctx) => {
    const name = ctx.req.param("name");

    stopProcess(name);

    return ctx.json({ message: `Process "${name}" stopped` });
  })
  .post("/:name/clear", (ctx) => {
    const name = ctx.req.param("name");

    clearProcessOutput(name);

    return ctx.json({ message: `Process "${name}" output cleared` });
  });

export { processes };
