import React from "react";
import ReactDOM from "react-dom";
import { BrowserRouter as Router } from "react-router-dom";
import { YMaps } from "react-yandex-maps";

import "./shared/services/firebase/clientApp";
import "./index.less";
import App from "./App";

ReactDOM.render(
  <React.StrictMode>
    <YMaps
    // query={{
    //   ns: 'use-load-option',
    //   load: 'package.full',
    // }}
    >
      <Router>
        <App />
      </Router>
    </YMaps>
  </React.StrictMode>,
  document.getElementById("root")
);
