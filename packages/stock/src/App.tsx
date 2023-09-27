import React, { useEffect } from "react";
import { Route, Routes, useLocation, useNavigate } from "react-router-dom";

import { Auth } from "./pages/auth";
import { Registration } from "./pages/registration";
import { Home } from "./pages/home";
import Profile from "./pages/profile";
import { routes } from "././shared/routes";
import { Loading } from "common/src/components/Loading";
import { Stock } from "./pages/stock";
import { useCurrentUser } from "common/src/services/api/useCurrentUser";
import { useBooks } from "common/src/services/books";
import { Reset } from "./pages/resetpass";

import "./App.less";
import { StockEdit } from "./pages/stockEdit";
import { Distributors } from "./pages/distributors";
import { Distributor } from "./pages/distributor";
import { DistributorEdit } from "./pages/distributorEdit";
import { useHolders } from "common/src/services/api/holders";
import { DistributorTransfer } from "./pages/distributorTransfer";
import { useHolderTransfers } from "common/src/services/api/holderTransfer";

const routesWithoutRedirect = [routes.registration, routes.auth, routes.resetpassemail];

function App() {
  const currentUser = useCurrentUser();
  const { profile, loading, user, userDocLoading } = currentUser;
  const { stock } = useHolders(profile?.stockId);
  const isStockLoading = profile?.stockId && !stock;
  const navigate = useNavigate();
  const location = useLocation();
  useBooks();
  const { loading: holderTransfersLoading } = useHolderTransfers(profile && { userId: profile.id });

  useEffect(() => {
    if (!loading && !userDocLoading) {
      // Пользователь не авторизован
      if (!user && !routesWithoutRedirect.includes(location.pathname)) {
        navigate(routes.auth);
      }
      // Авторизованный пользователь с незаполненым профилем
      if (
        user &&
        !profile?.stockId &&
        location.pathname !== routes.profile &&
        !routesWithoutRedirect.includes(location.pathname)
      ) {
        navigate(routes.profile);
      }
    }
  }, [loading, user, profile, navigate, location.pathname, userDocLoading]);

  if (loading || isStockLoading || holderTransfersLoading) {
    return <Loading currentUser={currentUser} />;
  }

  return (
    <div>
      <Routes>
        <Route path={routes.root} element={<Home currentUser={currentUser} />} />
        <Route path={routes.auth} element={<Auth currentUser={currentUser} />} />
        <Route path={routes.registration} element={<Registration currentUser={currentUser} />} />
        <Route path={routes.profile} element={<Profile currentUser={currentUser} />} />
        <Route path={routes.resetpassemail} element={<Reset currentUser={currentUser} />} />

        <Route path={routes.stock} element={<Stock currentUser={currentUser} />} />
        <Route path={routes.stockEdit} element={<StockEdit currentUser={currentUser} />} />
        <Route path={routes.distributors} element={<Distributors currentUser={currentUser} />} />
        <Route
          path={routes.distributorNew}
          element={<DistributorEdit currentUser={currentUser} />}
        />
        <Route path={routes.distributor} element={<Distributor currentUser={currentUser} />} />
        <Route
          path={routes.distributorTransfer}
          element={<DistributorTransfer currentUser={currentUser} />}
        />
      </Routes>
    </div>
  );
}

export default App;
