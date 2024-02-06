import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Teams from "./pages/teams";
import Departments from "./pages/departments";
import Home from "./pages/home";
import GiveFeedback from "./pages/give-feedback";
import Login from "./pages/login";
import ProtectiveRoutes from "./utils/ProtectiveRoute";
import { Provider } from "react-redux";
import store from "./redux/store";
import NotFound from "./pages/not-found";

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      { path: "teams", element: <ProtectiveRoutes><Teams /></ProtectiveRoutes> },
      { path: "departments", element: <ProtectiveRoutes><Departments /></ProtectiveRoutes>},
      { path: "feedbacks", element: <ProtectiveRoutes><Home /></ProtectiveRoutes> },
      { path: "give-feedback", element: <ProtectiveRoutes><GiveFeedback /></ProtectiveRoutes> },
      { path: "/", element: <Login /> },
      { path: "*", element: <NotFound /> }, // Add the NotFound route
    ],
  },
]);

const root = ReactDOM.createRoot(
  document.getElementById("root") as HTMLElement
);
root.render(
  <React.StrictMode>
    <Provider store={store}>
      <RouterProvider router={router} />
      </Provider>
  </React.StrictMode>
);
