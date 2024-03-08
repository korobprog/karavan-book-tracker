import i18n from "i18next";
import { initReactI18next } from "react-i18next";

// the translations
// (tip move them in a JSON file and import them,
// or even better, manage them separated from your code: https://react.i18next.com/guides/multiple-translation-files)
const resources = {
  en: {
    translation: {
      "home.hello": "Hello",
      "home.happy_sankirtana": "Happy sankirtana!",
      "home.report": "Report books",
      "home.my_statistic": "My statistic",
      "home.my_team": "My team",
      "home.map": "General statistics on the map",
      "home.donations": "Donation page",
      "home.second-wave": "Second-wave",
      "home.second-wave.help": "Send received contacts:",
      "home.contact": "Contact us",

      // TODO: Перевести
      "auth.title": "ВХОД В УЧЕТ КНИГ",
      "auth.email.label": "Email",
      "auth.email.error.required": "Пожалуйста, введите ваше имя пользователя",
      "auth.password.label": "Пароль",
      "auth.password.error.required": "Пожалуйста, введите пароль",
    },
  },
  ru: {
    translation: {
      "home.hello": "Привет",
      "home.heppy_sankirtana": "Удачной санкиртаны!",
      "home.report": "Отметить книги",
      "home.my_statistic": "Моя статистика",
      "home.my_team": "Моя команда",
      "home.map": "Общая статистика на карте",
      "home.donations": "Страница для пожертвований",
      "home.second-wave": "Вторая волна",
      "home.second-wave.help": "Отправить полученные контакты:",
      "home.contact": "Связаться с нами",

      "auth.title": "ВХОД В УЧЕТ КНИГ",
      "auth.email.label": "Email",
      "auth.email.error.required": "Пожалуйста, введите ваше имя пользователя",
      "auth.password.label": "Пароль",
      "auth.password.error.required": "Пожалуйста, введите пароль",
    },
  },
};

i18n
  .use(initReactI18next) // passes i18n down to react-i18next
  .init({
    resources,
    lng: "ru", // language to use, more information here: https://www.i18next.com/overview/configuration-options#languages-namespaces-resources
    // you can use the i18n.changeLanguage function to change the language manually: https://www.i18next.com/overview/api#changelanguage
    // if you're using a language detector, do not define the lng option

    interpolation: {
      escapeValue: false, // react already safes from xss
    },
  });

export default i18n;
