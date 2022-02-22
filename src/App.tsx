import "./App.css";
import { BrowserRouter, Route } from "react-router-dom";
import auth from './pages/auth'
import React from "react"


function App() {
  return (
    <BrowserRouter>
      <div>
      <Route path="/" component={auth} exact />
      </div>
    </BrowserRouter>
  );
}

export default App;