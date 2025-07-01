import app from "@api/app";
import { processesOrchestrator } from "@api/core/processes-orchestrator";
import { websocket } from "@api/routes/web-socket.route";

processesOrchestrator.init();

process.on("SIGINT", () => {
  processesOrchestrator.clear();

  process.exit(0);
});

process.on("SIGTERM", () => {
  processesOrchestrator.clear();

  process.exit(0);
});

export default {
  port: process.env.BACKEND_PORT || 3001,
  fetch: app.fetch,
  websocket: websocket,
};
