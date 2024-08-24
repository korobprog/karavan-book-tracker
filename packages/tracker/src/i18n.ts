import i18n from "i18next";
import { initReactI18next } from "react-i18next";

// the translations
// (tip move them in a JSON file and import them,
// or even better, manage them separated from your code: https://react.i18next.com/guides/multiple-translation-files)
const resources = {
  en: {
    translation: {
      "common.loading": "Loading",
      "common.save": "Save",

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

      "auth.title": "Login to BookTracker",
      "auth.email.label": "Email",
      "auth.email.error.required": "Please enter your username",
      "auth.password.label": "Password",
      "auth.password.error.required": "Please enter your password",
      "auth.remember_me": "Remember me",
      "auth.invalid_login_password": "Invalid login or password",
      "auth.login": "Login",
      "auth.registration": "Registration",
      "auth.login_with_google": "Login with Google",
      "auth.error_occurred": "An error occurred",
      "auth.login_disclaimer":
        "By clicking 'Login with Email/Google' above, you confirm that you have read and understood, and agree to the ",
      "auth.privacy_policy": "privacy policy",
      "auth.and": "and",
      "auth.terms_and_conditions": "terms and conditions",

      "profile.title": "Your profile",
      "profile.logout": "Logout",
      "profile.form.fill_profile": "Please fill in your profile",
      "profile.form.avatar_label": "Avatar",
      "profile.form.full_name_label": "Your Full Name",
      "profile.form.spiritual_name_label": "Your Spiritual Name",
      "profile.form.city_label": "Your City",
      "profile.form.yatra_label": "Your Yatra",
      "profile.form.phone_label": "Your Phone",
      "profile.form.phone_required_message": "Please enter your phone number!",
      "profile.form.phone_pattern_message": "Please enter a valid phone number",
      "profile.form.email_required_message": "Please enter email",
      "profile.form.address_label": "Your Address",
      "profile.form.email": "Email",

      "contact.title": "Contact Us",
      "contact.write_to_us": "Write to Us",
      "contact.write_to_us_with_bot": "Write to us using our",
      "contact.book_tracker_support": "BookTrackerSupport",
      "contact.bot_dasa": "bot Dasa on Telegram:",
      "contact.technical_support": "Technical support",
      "contact.send_story": "Send a story",
      "contact.app_instructions": "App instructions",
      "contact.support": "Support",
      "contact.book_tracker_developers": "BookTracker developers - Maxim Korobkov and Vadim Tokar",

      "donation.customize": "Customize Donation Page",
      "donation.your_qr": "this is Your Donation Page QR code",
      "donation.download_qr": "Download QR to Device",
      "donation.save_success": "Page saved successfully",

      "donation.form.titleBank": "Enter bank name",
      "donation.form.titleCard": "Enter card number",
      "donation.form.titleQr": "Enter QR link",
      "donation.form.titleButton": "Enter your title",

      "donation.form.setup_message_title": "Set Up Your Donation Page",
      "donation.form.setup_message_description":
        "You can customize your donation page and print QR codes for books as your business cards.",
      "donation.form.greeting_text_label": "Greeting Text",
      "donation.form.greeting_text_placeholder":
        "Enter greeting text, or leave empty. By default, it will be - You can donate to print and redeem books",
      "donation.form.bank_name_required": "Enter bank name",
      "donation.form.bank_label": "Bank",
      "donation.form.bank_placeholder": "Bank...",
      "donation.form.card_number_label": "Card Number",
      "donation.form.card_number_placeholder": "99009...",
      "donation.form.qr_link_label": "QR Link",
      "donation.form.qr_link_suffix_title": "Copy the link from your banking app",
      "donation.form.qr_link_placeholder": "http://site...",
      "donation.form.add_bank_details_button": "Add New Bank Details",
      "donation.form.button_label": "Button Text",
      "donation.form.button_placeholder": "By default - OnlinePay",
      "donation.form.contact_info_message": "Here you can specify your contacts and links:",
      "donation.form.telegram_placeholder": "Telegram link",
      "donation.form.telegram_suffix_title": "Example: mylogin",
      "donation.form.whats_placeholder": "Whats link",
      "donation.form.whats_suffix_title": "Example: 7xxxxxxxx",
      "donation.form.email_placeholder": "eMail",
      "donation.form.email_suffix_title": "Example: mymail@mail.com",
      "donation.form.other_links_placeholder": "other links",
      "donation.form.other_links_suffix_title": "Example: www.example.com",

      "report.form.warning_unauthrized":
        "Thank you, your operation has been added but is not yet confirmed. We will contact you shortly for confirmation.",
      "report.form.location_label": "Location",
      "report.form.location_required": "Select or create a new location",
      "report.form.online_label": "Online Distribution",
      "report.form.books_selected": "Books selected:",
      "report.form.reset": "Reset",
      "report.form.submitting": "Submitting...",
      "report.form.submit": "Submit",
      "report.form.search": "Search for a book",
      "report.form.optimizing_mode":
        "Enabling search optimization mode. Only the first 3 favorite and 3 non-favorite books are shown for faster performance.",
      "report.form.favorite_empty_no_found": "No favorites found",
      "report.form.favorite_empty_add": "Click on ⭐ to add to favorites",
      "report.form.list_empty": "No books found",
      "report.form.points": "Points:",
    },
  },
  ru: {
    translation: {
      "common.loading": "Загрузка",
      "common.save": "Сохранить",

      "home.hello": "Привет",
      "home.happy_sankirtana": "Удачной санкиртаны!",
      "home.report": "Отметить книги",
      "home.my_statistic": "Моя статистика",
      "home.my_team": "Моя команда",
      "home.map": "Общая статистика на карте",
      "home.donations": "Страница для пожертвований",
      "home.second-wave": "Вторая волна",
      "home.second-wave.help": "Отправить полученные контакты:",
      "home.contact": "Связаться с нами",

      "auth.title": "Вход в учет книг",
      "auth.email.label": "Email",
      "auth.email.error.required": "Пожалуйста, введите ваше имя пользователя",
      "auth.password.label": "Пароль",
      "auth.password.error.required": "Пожалуйста, введите пароль",
      "auth.remember_me": "Запомнить меня",
      "auth.invalid_login_password": "Неверный логин или пароль",
      "auth.login": "Войти",
      "auth.registration": "Регистрация",
      "auth.login_with_google": "Войти через Google",
      "auth.error_occurred": "При входе произошла ошибка",
      "auth.login_disclaimer":
        "Нажав 'Войти с помощью Email/Google' выше, вы подтверждаете, что прочитали и поняли, а также соглашаетесь с ",
      "auth.privacy_policy": "политикой конфиденциальности",
      "auth.and": "и",
      "auth.terms_and_conditions": "правилами и условиями",

      "profile.title": "Ваш профиль",
      "profile.logout": "Выйти",
      "profile.form.fill_profile": "Обязательно заполните профиль",
      "profile.form.avatar_label": "Аватар",
      "profile.form.full_name_label": "Ваше Ф.И.О",
      "profile.form.spiritual_name_label": "Ваше духовное имя",
      "profile.form.city_label": "Ваш город",
      "profile.form.yatra_label": "Ваша ятра",
      "profile.form.phone_label": "Ваш телефон",
      "profile.form.phone_required_message": "Пожалуйста, введите свой номер телефона!",
      "profile.form.phone_pattern_message": "Пожалуйста, введите корректный номер",
      "profile.form.email_required_message": "Пожалуйста, введите email",
      "profile.form.address_label": "Ваш адрес",
      "profile.form.email": "Email",

      "contact.title": "Связаться с нами",
      "contact.write_to_us": "Напишите нам",
      "contact.write_to_us_with_bot": "Напишите нам с помощью нашего",
      "contact.book_tracker_support": "BookTrackerSupport",
      "contact.bot_dasa": "бота Даса в Telegram:",
      "contact.technical_support": "Техническая поддержка",
      "contact.send_story": "Отправить историю",
      "contact.app_instructions": "Инструкция приложения",
      "contact.support": "Поддержка",
      "contact.book_tracker_developers":
        "Разработчики BookTracker - Коробков Максим и Вадим Токарь",

      "donation.customize": "Настроить страницу для пожертвований",
      "donation.your_qr": "это Ваш QR странички донатов",
      "donation.download_qr": "Скачать QR на устройство",
      "donation.save_success": "Страница успешно сохранена",

      "donation.form.titleBank": "Введите название банка",
      "donation.form.titleCard": "Введите номер карты",
      "donation.form.titleQr": "Введите ссылку на QR",
      "donation.form.titleButton": "Введите свое название",

      "donation.form.setup_message_title": "Настройте свою страницу пожертвований",
      "donation.form.setup_message_description":
        "Вы можете настроить свою страницу пожертвований и распечатать QR-коды для книг в качестве визитных карточек.",
      "donation.form.greeting_text_label": "Текст приветствия",
      "donation.form.greeting_text_placeholder":
        "Введите текст приветствия или оставьте пустым. По умолчанию будет написано - Вы можете пожертвовать на печать и выкуп книг",
      "donation.form.bank_name_required": "Введите название банка",
      "donation.form.bank_label": "Банк",
      "donation.form.bank_placeholder": "Банк...",
      "donation.form.card_number_label": "№ карты",
      "donation.form.card_number_placeholder": "99009...",
      "donation.form.qr_link_label": "cсылка на QR",
      "donation.form.qr_link_suffix_title": "Скопируйте ссылку с вашего банковского приложения",
      "donation.form.qr_link_placeholder": "http://site...",
      "donation.form.add_bank_details_button": "Добавить новые реквизиты банка",
      "donation.form.button_label": "Текст кнопки",
      "donation.form.button_placeholder": "По умолчанию - OnlinePay",
      "donation.form.contact_info_message": "Здесь вы можете указать свои контакты и ссылки:",
      "donation.form.telegram_placeholder": "ссылка на Telegram",
      "donation.form.telegram_suffix_title": "Пример: mylogin",
      "donation.form.whats_placeholder": "ссылка на Whats",
      "donation.form.whats_suffix_title": "Пример: 7xxxxxxxx",
      "donation.form.email_placeholder": "eMail",
      "donation.form.email_suffix_title": "Пример: mymail@mail.com",
      "donation.form.other_links_placeholder": "другие ссылки",
      "donation.form.other_links_suffix_title": "Пример: www.exemple.com",

      "report.form.warning_unauthrized":
        "Спасибо, ваша операция добавлена, но еще не подтверждена. Мы свяжемся с вами в ближайшее время для подтверждения.",
      "report.form.location_label": "Место",
      "report.form.location_required": "Выберите или создайте новое место",
      "report.form.online_label": "Онлайн-распространение",
      "report.form.books_selected": "Выбрано книг:",
      "report.form.reset": "Сбросить",
      "report.form.submitting": "Отправляем...",
      "report.form.submit": "Отправить",
      "report.form.search": "Поиск книги",
      "report.form.optimizing_mode":
        "Включение режима оптимизации  поиска. Для более быстрой работы показываются только первые 3 избранные и 3 не избранные книги",
      "report.form.favorite_empty_no_found": "Не найдено избранного",
      "report.form.favorite_empty_add": "Нажмите на ⭐, чтобы добавить в избранное",
      "report.form.list_empty": "Не найдено книг",
      "report.form.points": "Баллы:",
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
