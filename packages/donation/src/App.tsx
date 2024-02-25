import React from "react";
import { Route, Routes } from "react-router-dom";

import "antd/dist/reset.css";
import "./App.less";
import { Page404 } from "./pages/404";
import { routes } from "././shared/routes";
import { Page } from "./pages/page";

function App() {
  return (
    <div>
      <Routes>
        <Route path={routes.root} element={<Page404 />} />
        <Route path={routes.page} element={<Page />} />
      </Routes>
    </div>
  );
}

export default App;
