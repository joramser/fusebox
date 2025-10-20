import app from "@api/app";
import { processesOrchestrator } from "@api/core/processes-orchestrator";
import { logger } from "@api/lib/logger";
import { websocket } from "@api/routes/socket.route";
import {
  startLocalDomainService,
  stopLocalDomainService,
} from "@api/services/local-domain.service";

const port = Number(process.env.BACKEND_PORT) || 3001;
const environment = process.env.NODE_ENV || "development";

logger.info({ port, env: environment }, "Server starting");

await processesOrchestrator.init();
startLocalDomainService(port);

logger.info({ port }, "Server ready");

process.on("SIGINT", () => {
  logger.info("Graceful shutdown initiated (SIGINT)");
  stopLocalDomainService();
  processesOrchestrator.clear();

  process.exit(0);
});

process.on("SIGTERM", () => {
  logger.info("Graceful shutdown initiated (SIGTERM)");
  stopLocalDomainService();
  processesOrchestrator.clear();

  process.exit(0);
});

export default {
  port: port,
  fetch: app.fetch,
  websocket,
};
