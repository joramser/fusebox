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

export type DownstreamEvent =
  | AppLoadedEvent
  | ProcessUpdatedEvent
  | LineCreatedEvent
  | ProcessErrorEvent;
