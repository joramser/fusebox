import { rpcClient } from "@fusebox/api/rpc";

export const apiClient = rpcClient("/api");

export type Commands = keyof (typeof apiClient)["commands"][":name"];
