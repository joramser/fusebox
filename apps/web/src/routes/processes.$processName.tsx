import { createFileRoute } from "@tanstack/react-router";
import { ProcessDashboard } from "@web/containers/process-dashboard";
import { useStore } from "@web/store";

export const Route = createFileRoute("/processes/$processName")({
  loader: async ({ params }) => {
    useStore.getState().actions.setActiveProcess(params.processName);
  },
  component: ProcessDashboard,
});
