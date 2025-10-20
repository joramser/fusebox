import { upstreamEventSchema } from "@api/events";
import { upstreamEventMapper } from "@api/events/server-event-mapper";
import { logger } from "@api/lib/logger";
import { closeSocket, openSocket } from "@api/services/socket.service";
import { Hono } from "hono";
import { upgradeWebSocket, websocket } from "hono/bun";

const ws = new Hono().get(
  "/",
  upgradeWebSocket((_ctx) => {
    return {
      onOpen: (_event, ws) => {
        if (ws.raw) {
          openSocket(ws.raw);
        }
      },
      onClose: (_event, ws) => {
        if (ws.raw) {
          closeSocket(ws.raw);
        }
      },
      onMessage: (event, ws) => {
        if (!ws.raw) {
          return;
        }

        try {
          const data = JSON.parse(event.data.toString());
          const validatedEvent = upstreamEventSchema.parse(data);
          upstreamEventMapper(validatedEvent);
        } catch (error) {
          const errorMessage = error instanceof Error ? error.message : "Unknown error";

          logger.error({ error: errorMessage }, "Error handling upstream event");

          ws.raw.send(
            JSON.stringify({
              name: "v1.process-error",
              params: {
                processName: "",
                message: errorMessage,
              },
            }),
          );
        }
      },
    };
  }),
);

export { websocket, ws };
