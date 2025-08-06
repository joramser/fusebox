import { createFileRoute } from "@tanstack/react-router";
import { StreamDisplay } from "@web/containers/stream-display";
import { useStore } from "@web/store";

export const Route = createFileRoute("/processes/$processName")({
  loader: async ({ params }) => {
    useStore.getState().actions.setActiveProcess(params.processName);
  },
  component: StreamDisplay,
  head: (context) => ({
    meta: [
      {
        title: `${context.params.processName} - Fusebox`,
      },
    ],
  }),
});
