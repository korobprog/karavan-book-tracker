import "./App.css";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Auth from "./pages/auth";
import React from "react";

function App() {
  return (
    <BrowserRouter>
      <div>
        <Routes>
          <Route path="/" element={<Auth />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;
