import { Outlet } from "react-router-dom";
import MainNavigation from "./shared/components/Navigation/MainNavigation";

const App = () => {
  return (
    <>
      <MainNavigation />
      <main>
        <Outlet />
      </main>
    </>
  );
};

export default App;
