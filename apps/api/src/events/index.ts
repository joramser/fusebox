import {
  processOutputSchema,
  processSchema,
  processStatusSchema,
} from "@api/schemas/process.schema";
import { z } from "zod";

export const AppLoadedEvent = z.object({
  name: z.literal("v1.app-loaded"),
  params: z.object({
    processes: z.array(processSchema),
  }),
});

export const processUpdatedSchema = z.object({
  name: z.literal("v1.process-updated"),
  params: z.object({
    processName: z.string(),
    status: z.optional(processStatusSchema),
    output: z.optional(z.array(processOutputSchema)),
    pid: z.optional(z.number()),
  }),
});

export const lineCreatedEventSchema = z.object({
  name: z.literal("v1.line-created"),
  params: processOutputSchema.extend({
    processName: z.string(),
  }),
});

export const processErrorEventSchema = z.object({
  name: z.literal("v1.process-error"),
  params: z.object({
    processName: z.string(),
    message: z.string(),
  }),
});

export type AppLoadedEvent = z.infer<typeof AppLoadedEvent>;
export type ProcessUpdatedEvent = z.infer<typeof processUpdatedSchema>;
export type ProcessErrorEvent = z.infer<typeof processErrorEventSchema>;
export type LineCreatedEvent = z.infer<typeof lineCreatedEventSchema>;

export const downstreamEventSchema = z.discriminatedUnion("name", [
  AppLoadedEvent,
  processUpdatedSchema,
  lineCreatedEventSchema,
  processErrorEventSchema,
]);

export type DownstreamEvent = z.infer<typeof downstreamEventSchema>;

export const startProcessEventSchema = z.object({
  name: z.literal("v1.start-process"),
  params: z.object({
    processName: z.string(),
  }),
});

export const stopProcessEventSchema = z.object({
  name: z.literal("v1.stop-process"),
  params: z.object({
    processName: z.string(),
  }),
});

export const clearProcessOutputEventSchema = z.object({
  name: z.literal("v1.clear-process-output"),
  params: z.object({
    processName: z.string(),
  }),
});

export const openFolderCommandEventSchema = z.object({
  name: z.literal("v1.open-folder-command"),
  params: z.object({
    processName: z.string(),
  }),
});

export const openIdeCommandEventSchema = z.object({
  name: z.literal("v1.open-ide-command"),
  params: z.object({
    processName: z.string(),
  }),
});

export const commandSchema = z.enum(["open-folder", "open-ide"]);
export type CommandSchema = z.infer<typeof commandSchema>;

export type StartProcessEvent = z.infer<typeof startProcessEventSchema>;
export type StopProcessEvent = z.infer<typeof stopProcessEventSchema>;
export type ClearProcessOutputEvent = z.infer<typeof clearProcessOutputEventSchema>;
export type OpenFolderCommandEvent = z.infer<typeof openFolderCommandEventSchema>;
export type OpenIdeCommandEvent = z.infer<typeof openIdeCommandEventSchema>;

export const upstreamEventSchema = z.discriminatedUnion("name", [
  startProcessEventSchema,
  stopProcessEventSchema,
  clearProcessOutputEventSchema,
  openFolderCommandEventSchema,
  openIdeCommandEventSchema,
]);

export type UpstreamEvent = z.infer<typeof upstreamEventSchema>;
