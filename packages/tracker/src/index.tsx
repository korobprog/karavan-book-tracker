/* eslint-disable react/jsx-no-undef */
import React from "react";
import ReactDOM from "react-dom";
import { BrowserRouter } from "react-router-dom";
import "common/src/app/clientApp";
import { Offline, register as registerServiceWorker } from "common/src/app/offline";
import ru_RU from "antd/locale/ru_RU";
import App from "./App";
import reportWebVitals from "./reportWebVitals";
import { ConfigProvider } from "antd";
import moment from "moment";
import "moment/locale/ru";
import { YMaps } from "react-yandex-maps";

moment.locale("ru");

ReactDOM.render(
  <React.StrictMode>
    <BrowserRouter>
      <Offline>
        <ConfigProvider locale={ru_RU}>
          <YMaps query={{ apikey: process.env.REACT_APP_YMAP_KEY, lang: "ru_RU" }}>
            <App />
          </YMaps>
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
