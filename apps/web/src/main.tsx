import { createRouter, RouterProvider } from "@tanstack/react-router";
import { useWebSocket, WebSocketProvider } from "@web/context/websocket.context";
import ReactDOM from "react-dom/client";
import { routeTree } from "./routeTree.gen";

import "@web/index.css";
import { type ReactNode, useEffect } from "react";
import { ThemeProvider } from "./context/theme.context";
import { useStoreActions } from "./store";
import { downstreamEventMapper } from "./store/event-mapper";

// Set up a Router instance
const router = createRouter({
  routeTree,
  defaultPreload: "intent",
});

// Register things for typesafety
declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router;
  }
}

const rootElement = document.getElementById("app");

if (rootElement && !rootElement.innerHTML) {
  const root = ReactDOM.createRoot(rootElement);

  const app = (
    <ThemeProvider>
      <WebSocketProvider>
        <EventsSubscriberProvider>
          <RouterProvider router={router} />
        </EventsSubscriberProvider>
      </WebSocketProvider>
    </ThemeProvider>
  );

  root.render(app);
}

function EventsSubscriberProvider({ children }: { children: ReactNode }) {
  const { subscribe } = useWebSocket();
  const actions = useStoreActions();

  useEffect(() => {
    subscribe((message) => {
      downstreamEventMapper(actions)(message);
    });
  }, [actions, subscribe]);

  return children;
}
