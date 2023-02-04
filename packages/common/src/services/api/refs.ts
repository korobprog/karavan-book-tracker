import {
  collection,
  CollectionReference,
  doc,
  DocumentReference,
} from "firebase/firestore";
import { message } from "antd";
import { enableIndexedDbPersistence } from "firebase/firestore";
import { LocationDoc } from "./locations";
import { OperationDoc } from "./operations";
import { TeamDoc } from "./teams";
import { UserDoc, UserDocWithId } from "./useUser";
import { idConverter } from "./utils";

import { initializeFirestore, CACHE_SIZE_UNLIMITED } from "firebase/firestore";
import { getApps } from "firebase/app";

const apps = getApps();

const db = initializeFirestore(apps[0], {
  cacheSizeBytes: CACHE_SIZE_UNLIMITED,
});

enableIndexedDbPersistence(db)
  .then(() => message.info("Теперь поддерживается работа с прервающимся интернетом"))
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

const getCollectionRef = <Doc>(collectionName: string) =>
  collection(db, collectionName).withConverter(idConverter) as CollectionReference<Doc>;

const getDocRef = <Doc>(id: string, collectionName: string) =>
  doc(db, collectionName, id) as DocumentReference<Doc>;

const user = (id: string) => getDocRef<UserDoc>(id, "users");
const addUser = getCollectionRef<UserDoc>("users");
const users = getCollectionRef<UserDocWithId>("users");

const operation = (id: string) => getDocRef<OperationDoc>(id, "operations");
const operations = getCollectionRef<OperationDoc>("operations");

const location = (id: string) => getDocRef<LocationDoc>(id, "locations");
const locations = getCollectionRef<LocationDoc>("locations");

const team = (id: string) => getDocRef<TeamDoc>(id, "teams");
const teams = getCollectionRef<TeamDoc>("teams");

export const apiRefs = {
  user,
  addUser,
  users,
  operation,
  operations,
  location,
  locations,
  team,
  teams,
};
