import React from "react";
import { Route, Routes } from "react-router-dom";

import "./App.less";
import { Home } from "./pages/home";
import { VarnaG } from "./pages/varna-gauranga";
import { routes } from "././shared/routes";
import { EvgenyK } from "./pages/evgeny-kovalsky";

function App() {
  return (
    <div>
      <Routes>
        <Route path={routes.root} element={<Home />} />
        <Route path={routes.varnag} element={<VarnaG />} />
        <Route path={routes.evgenyk} element={<EvgenyK />} />
      </Routes>
    </div>
  );
}

export default App;
