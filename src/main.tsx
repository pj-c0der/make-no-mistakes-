import React from "react";
import ReactDOM from "react-dom/client";
import { createHashRouter, RouterProvider } from "react-router-dom";

import App from "./App";
import NotFound from "./pages/NotFound";
import PlaceholderHome from "./pages/PlaceholderHome";
import "./index.css";

const router = createHashRouter([
  {
    element: <App />,
    errorElement: <App />,
    children: [
      { path: "/", element: <PlaceholderHome /> },
      { path: "*", element: <NotFound /> },
    ],
  },
]);

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>,
);