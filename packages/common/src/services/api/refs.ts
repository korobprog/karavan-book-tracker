import {
  collection,
  CollectionReference,
  doc,
  DocumentReference,
  getFirestore,
} from "firebase/firestore";
import { LocationDoc } from "./locations";
import { OperationDoc, OperationDocWithId } from "./operations";
import { TeamDoc } from "./teams";
import { UserDoc, UserDocWithId } from "./useUser";
import { idConverter } from "./utils";
import { HolderTransferDoc } from "./holderTransfer";

const db = getFirestore();

const getCollectionRef = <Doc>(collectionName: string) =>
  collection(db, collectionName).withConverter(idConverter) as CollectionReference<Doc>;

const getDocRef = <Doc>(id: string, collectionName: string) =>
  doc(db, collectionName, id) as DocumentReference<Doc>;

const user = (id: string) => getDocRef<UserDoc>(id, "users");
const addUser = getCollectionRef<UserDoc>("users");
const users = getCollectionRef<UserDocWithId>("users");

const operation = (id: string) => getDocRef<OperationDoc>(id, "operations");
const operations = getCollectionRef<OperationDocWithId>("operations");

const location = (id: string) => getDocRef<LocationDoc>(id, "locations");
const locations = getCollectionRef<LocationDoc>("locations");

const team = (id: string) => getDocRef<TeamDoc>(id, "teams");
const teams = getCollectionRef<TeamDoc>("teams");

const holderTransfer = (id: string) => getDocRef<HolderTransferDoc>(id, "holder-transactions");
const holderTransfers = getCollectionRef<HolderTransferDoc>("holder-transactions");

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
  holderTransfer,
  holderTransfers,
};
