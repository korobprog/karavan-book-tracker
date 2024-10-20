import React from "react";
import ReactDOM from "react-dom";
import { BrowserRouter } from "react-router-dom";
import "common/src/app/clientApp";
import { Offline, register as registerServiceWorker } from "common/src/app/offline";
import { LocaleProvider } from "common/src/app/locale-provider/LocaleProvider";
import "./i18n";
import App from "./App";
import reportWebVitals from "./reportWebVitals";

ReactDOM.render(
  <React.StrictMode>
    <BrowserRouter>
      <Offline>
        <LocaleProvider>
          <App />
        </LocaleProvider>
      </Offline>
    </BrowserRouter>
  </React.StrictMode>,
  document.getElementById("root")
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
registerServiceWorker();
