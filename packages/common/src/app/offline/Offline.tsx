import React, { useEffect } from "react";
import { message } from "antd";
import "./firestore";

const onOnline = () => {
  message.info("Вы снова онлайн");
};

const onOffline = () => {
  message.warning("Потеряно соединение с интернетом");
};

export const Offline: React.FC = ({ children }) => {
  useEffect(() => {
    if (!navigator.onLine) {
      message.warning("Интернет не подключен");
    }

    window.addEventListener("online", onOnline);
    window.addEventListener("offline", onOffline);

    return () => {
      window.removeEventListener("online", onOnline);
      window.removeEventListener("offline", onOffline);
    };
  }, []);

  return <>{children}</>;
};
