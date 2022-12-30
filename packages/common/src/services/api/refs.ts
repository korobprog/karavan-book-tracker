import {
  collection,
  CollectionReference,
  doc,
  DocumentReference,
  getFirestore,
} from "firebase/firestore";
import { LocationDoc } from "./locations";
import { OperationDoc } from "./operations";
import { TeamDoc } from "./teams";
import { UserDoc, UserDocWithId } from "./useUser";
import { idConverter } from "./utils";

export const db = getFirestore();

const getCollection = <Doc>(collectionName: string) =>
  collection(db, collectionName).withConverter(
    idConverter
  ) as CollectionReference<Doc>;

const getDoc = <Doc>(id: string, collectionName: string) =>
  doc(db, collectionName, id) as DocumentReference<Doc>;

const user = (id: string) => getDoc<UserDoc>(id, "users");
const addUser = getCollection<UserDoc>("users");
const users = getCollection<UserDocWithId>("users");

const operation = (id: string) => getDoc<OperationDoc>(id, "operations");
const operations = getCollection<OperationDoc>("operations");

const location = (id: string) => getDoc<LocationDoc>(id, "locations");
const locations = getCollection<LocationDoc>("locations");

const team = (id: string) => getDoc<TeamDoc>(id, "teams");
const teams = getCollection<TeamDoc>("teams");

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
