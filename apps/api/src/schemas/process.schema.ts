import { z } from "zod";
import { processConfigurationSchema } from "./process-configuration.schema";

export const processStatusSchema = z.enum(["init", "running", "exited", "killed"]);

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
