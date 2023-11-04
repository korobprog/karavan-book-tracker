import React from "react";
import { Route, Routes } from "react-router-dom";

import "antd/dist/reset.css";
import "./App.less";
import { Page404 } from "./pages/404";
import { VarnaG } from "./pages/varna-gauranga";
import { routes } from "././shared/routes";
import { EvgenyK } from "./pages/evgeny-kovalsky";
import { OlgaK } from "./pages/olga-krasanova";
import { Page } from "./pages/page";

function App() {
  return (
    <div>
      <Routes>
        <Route path={routes.root} element={<Page404 />} />
        <Route path={routes.varnag} element={<VarnaG />} />
        <Route path={routes.evgenyk} element={<EvgenyK />} />
        <Route path={routes.olgak} element={<OlgaK />} />
        <Route path={routes.page} element={<Page />} />
      </Routes>
    </div>
  );
}

export default App;
