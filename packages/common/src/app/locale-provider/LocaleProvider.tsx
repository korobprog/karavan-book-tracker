import moment from "moment";
import React, { useEffect } from "react";
import { useTranslation } from "react-i18next";
import { Locale } from "antd/es/locale";
import ru_RU from "antd/locale/ru_RU";
import en_US from "antd/locale/en_US";
import { ConfigProvider } from "antd";

import "moment/locale/ru";

const localeMap: Record<string, Locale> = {
  en: en_US,
  ru: ru_RU,
};

export const LocaleProvider: React.FC = ({ children }) => {
  const { i18n } = useTranslation();

  useEffect(() => {
    moment.locale(i18n.language || "en");
  }, [i18n.language]);
  return <ConfigProvider locale={localeMap[i18n.language] || en_US}>{children}</ConfigProvider>;
};
