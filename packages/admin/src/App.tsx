import React, { useEffect } from "react";
import { Route, Routes, useNavigate, useLocation } from "react-router-dom";
import Auth from "./pages/auth";
import Registration from "./pages/registration";
import Home from "./pages/home";
import Report from "./pages/report";
import { routes } from "././shared/routes";
import { Reports } from "./pages/reports";
import { Locations } from "./pages/locations";
import { Users } from "./pages/users";
import { UsersNew } from "./pages/UsersNew";
import { useCurrentUser } from "./firebase/useCurrentUser";
import { Denied } from "./pages/denied";
import { Loading } from "./pages/loading";

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
      if (
        user &&
        !profile &&
        location.pathname !== routes.profile &&
        !routesWithoutRedirect.includes(location.pathname)
      ) {
        navigate(routes.profile);
      }
    }
  }, [loading, user, profile, navigate, location.pathname]);

  if (currentUser.loading) {
    return <Loading currentUser={currentUser} />;
  }

  if (currentUser.user && currentUser.profile?.role !== "admin") {
    return <Denied currentUser={currentUser} />;
  }

  return (
    <div>
      <Routes>
        <Route
          path={routes.root}
          element={<Home currentUser={currentUser} />}
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
          path={routes.reports}
          element={<Reports currentUser={currentUser} />}
        />
        <Route
          path={routes.report}
          element={<Report currentUser={currentUser} />}
        />
        <Route
          path={routes.locations}
          element={<Locations currentUser={currentUser} />}
        />
        <Route
          path={routes.users}
          element={<Users currentUser={currentUser} />}
        />
        <Route
          path={routes.usersNew}
          element={<UsersNew currentUser={currentUser} />}
        />
      </Routes>
    </div>
  );
}

export default App;
