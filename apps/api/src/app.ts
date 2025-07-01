import { pinoLogger } from "@api/middleware/logger-middleware";
import { commands } from "@api/routes/commands.route";
import { debug } from "@api/routes/debug.route";
import { processes } from "@api/routes/processes.route";
import { ws } from "@api/routes/web-socket.route";

import { Hono } from "hono";

const app = new Hono();

app.use(pinoLogger());

const routes = app
  .route("/ws", ws)
  .route("/processes", processes)
  .route("/commands", commands)
  .route("/debug", debug);

export type AppType = typeof routes;

export default app;
