import {
  createBrowserRouter,
  createRoutesFromElements,
  Navigate,
  Route,
  RouterProvider,
} from "react-router-dom";

import { AuthContext } from "./shared/context/auth-context";

import Layout from "./shared/components/Navigation/Layout";
import Users from "./user/pages/Users";
import NewPlace from "./places/pages/NewPlace";
import UserPlaces from "./places/pages/UserPlaces";
import UpdatePlace from "./places/pages/UpdatePlace";
import Auth from "./user/pages/Auth";
import useAuth from "./shared/hooks/auth-hook";

const App = (props) => {
  const { token, userId, login, logout } = useAuth();

  let routes;

  if (token) {
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
      value={{ isLoggedIn: !!token, token: token, userId: userId, login: login, logout: logout }}
    >
      <RouterProvider router={router} />
    </AuthContext.Provider>
  );
};

export default App;
