import type { DownstreamEvent } from "@fusebox/api/events";
import { toast } from "sonner";
import type { StoreState } from ".";

/**
 * Executes actions on the app store based on the downstream event received from the server.
 */
export const downstreamEventMapper = (store: StoreState["actions"]) => (event: DownstreamEvent) => {
  switch (event.name) {
    case "v1.process-updated":
      store.updateProcessStatus(event.params);
      break;
    case "v1.line-created":
      store.createLine(event.params);
      break;
    case "v1.process-error":
      toast.error(event.params.message);
      break;
    default:
      console.warn(`Unhandled event: ${event}`);
  }
};
