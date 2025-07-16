import { createFileRoute, redirect } from "@tanstack/react-router";
import { ProcessDashboard } from "@web/containers/process-dashboard";
import type { StoreState } from "@web/store";
import { useStore } from "@web/store";

export const Route = createFileRoute("/processes")({
  loader: async ({ params }: { params: { processName?: string } }) => {
    if (useStore.getState().processes.size > 0) {
      return;
    }

    const processes = await new Promise<StoreState["processes"]>((resolve) => {
      useStore.subscribe(
        (state) => state.processes,
        (processes) => resolve(processes),
      );
    });

    const firstProcess = processes.values().next().value;

    if (processes.size === 0 || !firstProcess) {
      return {};
    }

    const processName = params.processName ?? firstProcess.name;

    throw redirect({
      to: `/processes/$processName`,
      params: { processName },
    });
  },
  component: ProcessDashboard,
});
