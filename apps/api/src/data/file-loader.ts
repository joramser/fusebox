import { logger } from "@api/lib/logger";
import {
  type ProcessConfigurationSchema,
  processesConfigurationSchema,
} from "@api/schemas/process-configuration.schema";

const FILE_PATH = "./processes.json";

export const loadUserProcesses = async () => {
  const file = Bun.file(FILE_PATH);
  const json = await file.json();

  try {
    const processes = processesConfigurationSchema.parse(json);

    logger.info({ filePath: FILE_PATH, count: processes.length }, "Loaded process configurations");

    return processes;
  } catch (error) {
    logger.error(error, "Failed to load process configurations");
    return [];
  }
};

export const saveUserProcesses = async (processes: ProcessConfigurationSchema[]) => {
  await Bun.write(FILE_PATH, JSON.stringify(processes, null, 2));
};
