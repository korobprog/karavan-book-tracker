import React from "react";
import { Route, Routes } from "react-router-dom";

import { routes } from "routes";
import { HomePage } from "pages/home";

function App() {
  return (
    <Routes>
      <Route path={routes.root} element={<HomePage />} />
    </Routes>
  );
}

export default App;
