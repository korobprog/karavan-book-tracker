import { enableIndexedDbPersistence } from "firebase/firestore";
import { initializeFirestore, CACHE_SIZE_UNLIMITED } from "firebase/firestore";
import { getApps } from "firebase/app";
import { message } from "antd";

// Включение оффлайн режима для firestore
const apps = getApps();
const db = initializeFirestore(apps[0], {
  cacheSizeBytes: CACHE_SIZE_UNLIMITED,
});

enableIndexedDbPersistence(db)
  .then(() => console.log("Поддерживается работа с прервающимся интернетом"))
  .catch((err) => {
    if (err.code == "failed-precondition") {
      message.warning(
        "Приложение открыто на нескольких вкладках. Оффлайн сохранение не будет работать. Закройте прочие вкладки и обновите страницу",
        5
      );
    } else if (err.code == "unimplemented") {
      message.warning(
        "Ваш браузер не поддерживает оффлайн сохраниние информации.Для использования приложения с плохим интернетом установите его через Chrome, Safari, или Firefox браузер",
        5
      );
    }
  });
