import { createRouter, RouterProvider } from "@tanstack/react-router";
import { WebSocketProvider } from "@web/context/websocket.context";
import ReactDOM from "react-dom/client";
import { routeTree } from "./routeTree.gen";

import "@web/index.css";
import { ThemeProvider } from "./context/theme.context";

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
        <RouterProvider router={router} />
      </WebSocketProvider>
    </ThemeProvider>
  );

  root.render(app);
}
