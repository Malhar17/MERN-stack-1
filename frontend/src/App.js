import {
  createBrowserRouter,
  createRoutesFromElements,
  Navigate,
  Route,
  RouterProvider,
} from "react-router-dom";

import { AuthContext } from "./shared/context/auth-context";
import { useCallback, useState } from "react";
import Layout from "./shared/components/Navigation/Layout";
import Users from "./user/pages/Users";
import NewPlace from "./places/pages/NewPlace";
import UserPlaces from "./places/pages/UserPlaces";
import UpdatePlace from "./places/pages/UpdatePlace";
import Auth from "./user/pages/Auth";

const App = (props) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userId, setUserId] = useState(null);

  const login = useCallback((uid) => {
    setIsLoggedIn(true);
    setUserId(uid);
  }, []);

  const logout = useCallback(() => {
    setIsLoggedIn(false);
    setUserId(null);
  }, []);

  let routes;

  if (isLoggedIn) {
    routes = (
      <Route path="/" element={<Layout />}>
        <Route index element={<Users />} />
        <Route path=":userId/places" element={<UserPlaces />} />
        <Route path="places">
          <Route path="new" element={<NewPlace />} />
          <Route path=":placeId" element={<UpdatePlace />} />
        </Route>
        <Route path="*" element={<Navigate to="/" replace />} />
      </Route>
    );
  } else {
    routes = (
      <Route path="/" element={<Layout />}>
        <Route index element={<Users />} />
        <Route path=":userId/places" element={<UserPlaces />} />
        <Route path="auth" element={<Auth />} />
        <Route path="*" element={<Navigate to="/auth" replace />} />
      </Route>
    );
  }

  const router = createBrowserRouter(createRoutesFromElements(routes));

  return (
    <AuthContext.Provider
      value={{ isLoggedIn: isLoggedIn, userId: userId, login: login, logout: logout }}
    >
      <RouterProvider router={router} />
    </AuthContext.Provider>
  );
};

export default App;
