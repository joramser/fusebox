import { closeSocket, openSocket } from "@api/services/socket.service";
import type { ServerWebSocket } from "bun";

import { Hono } from "hono";
import { createBunWebSocket } from "hono/bun";

const { upgradeWebSocket, websocket } = createBunWebSocket<ServerWebSocket>();

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
    };
  }),
);

export { websocket, ws };
