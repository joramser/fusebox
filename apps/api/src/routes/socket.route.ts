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
    };
  }),
);

export { websocket, ws };
