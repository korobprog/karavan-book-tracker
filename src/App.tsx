import React, { useEffect } from "react";
import { Route, Routes, useLocation, useNavigate } from "react-router-dom";

import { Auth } from "./pages/auth";
import { Registration } from "./pages/registration";
import { Home } from "./pages/home";
import Profile from "./pages/profile";
import { routes } from "././shared/routes";
import { Loading } from "./pages/loading";
import { Report } from "./pages/report";
import { useCurrentUser } from "./firebase/useCurrentUser";

import "./App.less";

const routesWithoutRedirect = [routes.registration, routes.auth];

function App() {
  const currentUser = useCurrentUser();
  const { profile, loading, user } = currentUser;
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (!loading) {
      // Пользователь не авторизован
      if (!user && !routesWithoutRedirect.includes(location.pathname)) {
        navigate(routes.auth);
      }
      // Авторизованный пользователь с незаполненым профилем
      if (user && !profile && location.pathname !== routes.profile && !routesWithoutRedirect.includes(location.pathname)) {
        navigate(routes.profile);
      }
    }
  }, [loading, user, profile, navigate, location.pathname]);

  if (loading) {
    return <Loading currentUser={currentUser} />;
  }

  return (
    <div>
      <Routes>
        <Route
          path={routes.root}
          element={<Home currentUser={currentUser} />}
        />
        <Route
          path={routes.report}
          element={<Report currentUser={currentUser} />}
        />
        <Route
          path={routes.auth}
          element={<Auth currentUser={currentUser} />}
        />
        <Route
          path={routes.registration}
          element={<Registration currentUser={currentUser} />}
        />
        <Route
          path={routes.profile}
          element={<Profile currentUser={currentUser} />}
        />
      </Routes>
    </div>
  );
}

export default App;
