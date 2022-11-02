import {
  collection,
  CollectionReference,
  getFirestore,
  addDoc,
  query,
  orderBy,
  deleteDoc,
  doc,
  getDocs,
  where,
} from "firebase/firestore";
import { useCollectionData } from "react-firebase-hooks/firestore";
import { idConverter } from "./utils";

export type DistributedBook = {
  bookId: number;
  count: number;
};

export type OperationDoc = {
  id?: string;
  date: string;
  userId: string;
  userName: string;
  locationId: string;
  totalCount: number;
  totalPoints: number;
  books: DistributedBook[];
  isAuthorized?: boolean;
  isOnline?: boolean;
  isWithoutBookInformation?: boolean;
  isTeamOperation?: boolean;
};

const db = getFirestore();

const operationsRef = collection(db, "operations").withConverter(
  idConverter
) as CollectionReference<OperationDoc>;

export const getOperations = async () => {
  return await getDocs(operationsRef);
};

export const addOperation = async (params: OperationDoc) => {
  addDoc(operationsRef, params);
};

export const deleteOperation = async (id?: string | number) => {
  if (id) {
    const operationRef = doc(db, "operations", String(id));
    deleteDoc(operationRef);
  }
};

export const useOperations = () => {
  const [operationsDocData, loading] =
    useCollectionData<OperationDoc>(
      query(operationsRef, orderBy("date", "desc"))
    );

  return { operationsDocData, loading };
};

  // TODO: add useUserOperationsCollection - firebase can't sort by time of one user
export const useMyOperations = (userId: string) => {
  const [myOperationsDocData, loading] =
    useCollectionData<OperationDoc>(
      query(operationsRef, where("userId", "==", userId || ""))
    );

  return { myOperationsDocData, loading };
};
