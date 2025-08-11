import { createRootRoute, HeadContent, Outlet } from "@tanstack/react-router";
import { TanStackRouterDevtools } from "@tanstack/react-router-devtools";
import { Toaster } from "@web/components/ui/sonner";

export const Route = createRootRoute({
  component: RootComponent,
  head: () => ({
    meta: [
      {
        title: "Fusebox",
      },
    ],
  }),
});

function RootComponent() {
  return (
    <>
      <HeadContent />
      <Outlet />
      <Toaster />
      {import.meta.env.DEV && <TanStackRouterDevtools position="bottom-right" />}
    </>
  );
}
