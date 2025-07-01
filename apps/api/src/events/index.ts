import { processOutputSchema, processStatusSchema } from "@api/schemas/process.schema";
import { z } from "zod";

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

export type ProcessUpdatedEvent = z.infer<typeof processUpdatedSchema>;
export type ProcessErrorEvent = z.infer<typeof processErrorEventSchema>;
export type LineCreatedEvent = z.infer<typeof lineCreatedEventSchema>;

export type DownstreamEvent = ProcessUpdatedEvent | LineCreatedEvent | ProcessErrorEvent;
