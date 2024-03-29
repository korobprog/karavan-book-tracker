import React, { useEffect } from "react";
import { Route, Routes, useLocation } from "react-router-dom";

import { useTransitionNavigate } from "common/src/utils/hooks/useTransitionNavigate";
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
import DonationsPage from "./pages/donationsPage";
import { useCurrentUser } from "common/src/services/api/useCurrentUser";
import { useBooks } from "common/src/services/books";
import { Reset } from "./pages/resetpass";
import { Privacy } from "./pages/privacy";
import { PrivacyPolicy } from "./pages/privacyPolicy";

import "antd/dist/reset.css";
import "./App.less";
import DonationsPageForm from "./pages/donationsPageForm";
import { ContactUs } from "./pages/contactus";
import { TeamNew } from "./pages/teamNew";

const routesWithoutRedirect = [
  routes.registration,
  routes.auth,
  routes.resetpassemail,
  routes.privacy,
  routes.privacyPolicy,
  routes.contactUs,
];

function App() {
  const currentUser = useCurrentUser();
  const { profile, loading, user, userDocLoading } = currentUser;
  const navigate = useTransitionNavigate();
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
        <Route path={routes.reportEdit} element={<ReportEdit currentUser={currentUser} />} />
        <Route path={routes.statistic} element={<Statistic currentUser={currentUser} />} />
        <Route path={routes.auth} element={<Auth currentUser={currentUser} />} />
        <Route path={routes.registration} element={<Registration currentUser={currentUser} />} />
        <Route path={routes.profile} element={<Profile currentUser={currentUser} />} />
        <Route path={routes.resetpassemail} element={<Reset currentUser={currentUser} />} />
        <Route path={routes.team} element={<Team currentUser={currentUser} />} />
        <Route path={routes.teamNew} element={<TeamNew currentUser={currentUser} />} />
        <Route path={routes.teamEdit} element={<TeamEdit currentUser={currentUser} />} />
        <Route path={routes.privacy} element={<Privacy />} />
        <Route path={routes.privacyPolicy} element={<PrivacyPolicy />} />
        <Route path={routes.contactUs} element={<ContactUs />} />
        <Route
          path={routes.pageDonationsForm}
          element={
            <DonationsPageForm
              currentUser={currentUser}
              initialValues={{
                active: false,
                banks: [],
                socialTelegram: undefined,
                socialWhats: undefined,
                socialMail: undefined,
                socialLink: undefined,
                avatar: undefined,
                userName: undefined,
                greetingText: undefined,
                buttonBank: undefined,
              }}
            />
          }
        />
        <Route
          path={routes.pageDonations}
          element={
            <DonationsPage
              currentUser={currentUser}
              initialValues={{
                active: false,
                banks: [],
                socialTelegram: undefined,
                socialWhats: undefined,
                socialMail: undefined,
                socialLink: undefined,
                avatar: undefined,
                userName: undefined,
                greetingText: undefined,
                buttonBank: undefined,
              }}
            />
          }
        />
      </Routes>
    </div>
  );
}

export default App;
