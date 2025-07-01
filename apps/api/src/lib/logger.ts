import pino from "pino";
import { PinoPretty } from "pino-pretty";

export const logger = pino(
  { level: process.env.LOG_LEVEL ?? "info" },
  process.env.NODE_ENV === "production"
    ? undefined
    : PinoPretty({
        colorize: true,
      }),
);
