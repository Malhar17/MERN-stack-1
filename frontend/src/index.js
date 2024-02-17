import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import {
  createBrowserRouter,
  createRoutesFromElements,
  Navigate,
  Route,
  RouterProvider,
} from "react-router-dom";

import Users from "./user/pages/Users";
import NewPlace from "./places/pages/NewPlace";
import UserPlaces from "./places/pages/UserPlaces";
import UpdatePlace from "./places/pages/UpdatePlace";
import "./index.scss";

const root = ReactDOM.createRoot(document.getElementById("root"));
const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path="/" element={<App />}>
      <Route index element={<Users />} />
      <Route path=":userId/places" element={<UserPlaces />} />
      <Route path="places">
        <Route path="new" element={<NewPlace />} />
        <Route path=":placeId" element={<UpdatePlace />} />
      </Route>
      <Route path="*" element={<Navigate to="/" replace />} />
    </Route>
  )
);
root.render(<RouterProvider router={router} />);
