
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Auth from "./pages/auth";
import Registration from "./pages/registration";
import React from "react";

function App() {
  return (
    <BrowserRouter>
      <div>
        <Routes>
          <Route path="/" element={<Auth />} />
          <Route path="/registration" element={<Registration />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;
