import { z } from "zod";

export const processConfigurationSchema = z.object({
  name: z.string(),
  cwd: z.string(),
  args: z.string(),
  command: z.string(),
  env: z.record(z.string()).optional(),
});

export const processesConfigurationSchema = z.array(processConfigurationSchema);

export type ProcessConfigurationSchema = z.infer<typeof processConfigurationSchema>;

export type ProcessesConfigurationSchema = z.infer<typeof processesConfigurationSchema>;
