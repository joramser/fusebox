import Bonjour, { type Service } from "bonjour-service";

let bonjourInstance: Bonjour | null = null;
let serviceInstance: Service | null = null;

export function startLocalDomainService(port: number) {
  try {
    bonjourInstance = new Bonjour();

    serviceInstance = bonjourInstance.publish({
      name: "Fusebox",
      type: "http",
      port: port,
      host: "fusebox.local",
    });

    console.log(`📡 Bonjour service published: fusebox.local:${port}`);
  } catch (error) {
    console.error("Failed to start Bonjour service:", error);
  }
}

export function stopLocalDomainService() {
  if (serviceInstance?.stop) {
    serviceInstance.stop();
    serviceInstance = null;
  }

  if (bonjourInstance) {
    bonjourInstance.destroy();
    bonjourInstance = null;
  }
}
