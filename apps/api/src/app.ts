import { pinoLogger } from "@api/middleware/logger-middleware";
import { debug } from "@api/routes/debug.route";
import { ws } from "@api/routes/socket.route";

import { Hono } from "hono";
import { serveStatic } from "hono/bun";

const app = new Hono();

app.use(pinoLogger());

const routes = app.route("/api/ws", ws).route("/api/debug", debug);

if (process.env.NODE_ENV === "production") {
  app.use("/assets/*", serveStatic({ root: "../web/dist" }));
  app.use("/favicon*.png", serveStatic({ root: "../web/dist" }));
  app.use("/favicon.ico", serveStatic({ root: "../web/dist" }));

  // SPA fallback
  app.get("*", serveStatic({ path: "../web/dist/index.html" }));
}

export type AppType = typeof routes;

export default app;
