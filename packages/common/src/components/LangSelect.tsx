import React from "react";
import { Select } from "antd";
import { useTranslation } from "react-i18next";

export const LangSelect = () => {
  const { i18n } = useTranslation();

  const handleChange = (value: string) => {
    console.log(value);
    i18n.changeLanguage(value);
  };

  return (
    <Select
      defaultValue="ru"
      style={{ width: 100 }}
      onChange={handleChange}
      options={[
        { value: "ru", label: "Русский" },
        { value: "en", label: "English" },
      ]}
    />
  );
};
