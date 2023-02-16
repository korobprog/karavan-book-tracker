import React, { useEffect } from "react";
import { message } from "antd";
import "./firestore";
import { isOnlineChanged } from "./lib/isOnlineStore";

const onOnline = () => {
  message.info("Вы снова онлайн");
  isOnlineChanged(true);
};

const onOffline = () => {
  message.warning("Потеряно соединение с интернетом");
  isOnlineChanged(false);
};

export const Offline: React.FC = ({ children }) => {
  useEffect(() => {
    if (!navigator.onLine) {
      message.warning("Интернет не подключен");
      isOnlineChanged(false);
    } else {
      isOnlineChanged(true);
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
