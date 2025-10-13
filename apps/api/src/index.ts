import app from "@api/app";
import { processesOrchestrator } from "@api/core/processes-orchestrator";
import { websocket } from "@api/routes/web-socket.route";
import {
  startLocalDomainService,
  stopLocalDomainService,
} from "@api/services/local-domain.service";

const port = Number(process.env.BACKEND_PORT) || 3001;

processesOrchestrator.init();
startLocalDomainService(port);

process.on("SIGINT", () => {
  stopLocalDomainService();
  processesOrchestrator.clear();

  process.exit(0);
});

process.on("SIGTERM", () => {
  stopLocalDomainService();
  processesOrchestrator.clear();

  process.exit(0);
});

export default {
  port: port,
  fetch: app.fetch,
  websocket: websocket,
};
