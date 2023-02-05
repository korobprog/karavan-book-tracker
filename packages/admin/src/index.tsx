import React from "react";
import ReactDOM from "react-dom";
import { BrowserRouter } from "react-router-dom";
import "common/src/app/clientApp";
import { Offline, register as registerServiceWorker } from "common/src/app/offline";
import ru_RU from "antd/lib/locale/ru_RU";
import App from "./App";
import reportWebVitals from "./reportWebVitals";

import "moment/locale/ru";
import moment from "moment";
import { ConfigProvider } from "antd";

moment.locale("ru");

ReactDOM.render(
  <React.StrictMode>
    <BrowserRouter>
      <Offline>
        <ConfigProvider locale={ru_RU}>
          <App />
        </ConfigProvider>
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
