import type { AppType } from "@api/app";
import { hc } from "hono/client";

const client = hc<AppType>("/");
export type Client = typeof client;

export const rpcClient = (...args: Parameters<typeof hc>) => hc<AppType>(...args);
