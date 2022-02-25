
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Auth from "./pages/auth";
import Registration from "./pages/registration";
import React from "react";
import {routes} from "././shared/routes"

function App() {
  return (
    <BrowserRouter>
      <div>
        <Routes>
        <Route path={routes.root} element={<Auth/>} />
          <Route path={routes.auth} element={<Auth />} />
          <Route path={routes.registration} element={<Registration />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;
