import { z } from "zod";
import { processConfigurationSchema } from "./process-configuration.schema";

export const processStatusSchema = z.enum([
  "init", // Process is created by not running
  "running", // Process is running
  "exited", // Process exited normally without user intervention
  "stopped", // Process was stopped by user
  "killed", // Process was force stopped (non-zero exit code)
]);

export const processOutputSchema = z.object({
  number: z.number(),
  line: z.string(),
});

export const processSchema = processConfigurationSchema.extend({
  spawn: z.object({
    status: processStatusSchema,
    output: z.array(processOutputSchema).default([]),
    pid: z.number().optional(),
  }),
});

export type ProcessSchema = z.infer<typeof processSchema>;

export type ProcessStatusSchema = z.infer<typeof processStatusSchema>;

export type ProcessOutputSchema = z.infer<typeof processOutputSchema>;
