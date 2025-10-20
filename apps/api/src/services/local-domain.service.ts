import { logger } from "@api/lib/logger";
import Bonjour, { type Service } from "bonjour-service";

let bonjourInstance: Bonjour | null = null;
let serviceInstance: Service | null = null;

const isServiceRunning = async (port: number) => {
  const browser = bonjourInstance?.find({ type: "http" });

  if (!browser) {
    return false;
  }

  const waitForBrowser = new Promise((resolve) => {
    browser.on("up", (service) => {
      if (service.name === "Fusebox" && service.port === port) {
        return resolve(true);
      }
    });
  });

  const timeoutHandler = new Promise((resolve) => {
    setTimeout(() => {
      return resolve(false);
    }, 100);
  });

  const result = await Promise.race([waitForBrowser, timeoutHandler]);

  browser.stop();

  return result;
};

export const startLocalDomainService = async (port: number) => {
  try {
    if (!bonjourInstance) {
      bonjourInstance = new Bonjour();
    }
    const isRunning = await isServiceRunning(port);

    if (!isRunning && !serviceInstance) {
      serviceInstance = bonjourInstance.publish({
        name: "Fusebox",
        type: "http",
        port: port,
        host: "fusebox.local",
      });

      logger.info({ port, host: "fusebox.local" }, "Local domain service started");
    }
  } catch (error) {
    logger.error(
      { error: error instanceof Error ? error.message : "Unknown error" },
      "Failed to start local domain service"
    );
  }
};

export const stopLocalDomainService = () => {
  if (serviceInstance?.stop) {
    serviceInstance.stop();
    serviceInstance = null;
  }

  if (bonjourInstance) {
    bonjourInstance.destroy();
    bonjourInstance = null;
  }
};
