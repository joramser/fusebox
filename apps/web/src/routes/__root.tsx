import { createRootRoute, Outlet } from "@tanstack/react-router";
import { TanStackRouterDevtools } from "@tanstack/router-devtools";
import { Toaster } from "@web/components/ui/sonner";
import { useWebSocket } from "@web/context/websocket.context";
import { useStoreActions } from "@web/store";
import { downstreamEventMapper } from "@web/store/event-mapper";
import { useEffect } from "react";

export const Route = createRootRoute({
  component: RootComponent,
});

function RootComponent() {
  const { subscribe } = useWebSocket();
  const actions = useStoreActions();

  useEffect(() => {
    subscribe((message) => {
      downstreamEventMapper(actions)(message);
    });
  }, [actions, subscribe]);

  return (
    <>
      <Outlet />
      <Toaster />
      {import.meta.env.DEV && <TanStackRouterDevtools position="bottom-right" />}
    </>
  );
}
