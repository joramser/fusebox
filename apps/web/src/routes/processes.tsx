import { createFileRoute, redirect } from "@tanstack/react-router";
import { ProcessDashboard } from "@web/containers/process-dashboard";

import { apiClient } from "@web/lib/rpc-client";
import { useStore } from "@web/store";

export const Route = createFileRoute("/processes")({
  loader: async ({ params }: { params: { processName?: string } }) => {
    if (useStore.getState().processes.length > 0) {
      return;
    }

    const response = await apiClient.processes.$get({});
    const processes = await response.json();

    useStore.getState().actions.setProcesses(processes);

    if (processes.length === 0 || !processes[0]) {
      return {};
    }

    const processName = params.processName ?? processes[0]?.name;

    throw redirect({
      to: `/processes/$processName`,
      params: { processName },
    });
  },
  component: ProcessDashboard,
});
