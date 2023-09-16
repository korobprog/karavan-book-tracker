import React from "react";
import { Route, Routes } from "react-router-dom";

import "./App.less";
import { Home } from "./pages/home";
import { routes } from "././shared/routes";

function App() {
  return (
    <div>
      <Routes>
        <Route path={routes.root} element={<Home />} />
      </Routes>
    </div>
  );
}

export default App;
