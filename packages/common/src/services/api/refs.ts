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
import { HolderDistributorDoc, HolderDoc, HolderStockDoc } from "./holders";
import { HolderTransferDoc } from "./holderTransfer";
import { DonationPageDoc } from "./donation";

export type WithId<T> = { id: string } & T;

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

const holder = (id: string) =>
  getDocRef<HolderDoc>(id, "holders").withConverter<WithId<HolderDoc>>(idConverter);
const holders = getCollectionRef<HolderDoc>("holders");
const stock = (id: string) =>
  getDocRef<HolderDoc>(id, "holders").withConverter<WithId<HolderStockDoc>>(idConverter);
const distributors = getCollectionRef<WithId<HolderDistributorDoc>>("holders");

const holderTransfer = (id: string) => getDocRef<HolderTransferDoc>(id, "holder-transactions");
const holderTransfers = getCollectionRef<WithId<HolderTransferDoc>>("holder-transactions");

const donationPage = (id: string) => getDocRef<DonationPageDoc>(id, "donationPage");
const donationPages = getCollectionRef<DonationPageDoc>("donationPage");

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
  holder,
  holders,
  stock,
  distributors,
  holderTransfer,
  holderTransfers,
  donationPage,
  donationPages,
};
