import React, { useEffect } from "react";
import { Route, Routes, useLocation, useNavigate } from "react-router-dom";

import { Auth } from "./pages/auth";
import { Registration } from "./pages/registration";
import { Home } from "./pages/home";
import Profile from "./pages/profile";
import { routes } from "././shared/routes";
import { Loading } from "common/src/components/Loading";
import { Report } from "./pages/report";
import { ReportEdit } from "./pages/reportEdit";
import { Statistic } from "./pages/statistic";
import { Team } from "./pages/team";
import { TeamEdit } from "./pages/teamEdit";
import { useCurrentUser } from "common/src/services/api/useCurrentUser";
import { useBooks } from "common/src/services/books";

import "./App.less";

const routesWithoutRedirect = [routes.registration, routes.auth];

function App() {
  const currentUser = useCurrentUser();
  const { profile, loading, user, userDocLoading } = currentUser;
  const navigate = useNavigate();
  const location = useLocation();
  useBooks();

  useEffect(() => {
    if (!loading && !userDocLoading) {
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
  }, [loading, user, profile, navigate, location.pathname, userDocLoading]);

  if (loading) {
    return <Loading currentUser={currentUser} />;
  }

  return (
    <div>
      <Routes>
        <Route path={routes.root} element={<Home currentUser={currentUser} />} />
        <Route path={routes.report} element={<Report currentUser={currentUser} />} />
        <Route path={routes.reportEdit()} element={<ReportEdit currentUser={currentUser} />} />
        <Route path={routes.statistic} element={<Statistic currentUser={currentUser} />} />
        <Route path={routes.auth} element={<Auth currentUser={currentUser} />} />
        <Route path={routes.registration} element={<Registration currentUser={currentUser} />} />
        <Route path={routes.profile} element={<Profile currentUser={currentUser} />} />
        <Route path={routes.team} element={<Team currentUser={currentUser} />} />
        <Route path={routes.teamEdit} element={<TeamEdit currentUser={currentUser} />} />
      </Routes>
    </div>
  );
}

export default App;
