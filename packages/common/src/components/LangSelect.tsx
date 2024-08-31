import { Select } from "antd";
import { useTranslation } from "react-i18next";

export const getLang = () => localStorage.getItem("current_language");
export const setLang = (value: string) => localStorage.setItem("current_language", value);

export const LangSelect = () => {
  const { i18n } = useTranslation();

  const handleChange = (value: string) => {
    setLang(value);
    i18n.changeLanguage(value);
  };
  return (
    <Select
      defaultValue={i18n.language}
      style={{ width: 100 }}
      onChange={handleChange}
      options={[
        { value: "ru", label: "Русский" },
        { value: "en", label: "English" },
      ]}
    />
  );
};
