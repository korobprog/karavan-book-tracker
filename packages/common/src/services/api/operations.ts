import {
  addDoc,
  query,
  orderBy,
  deleteDoc,
  getDocs,
  where,
  getDoc,
} from "firebase/firestore";
import {
  useCollectionData,
  useDocumentData,
} from "react-firebase-hooks/firestore";
import { apiRefs } from "./refs";

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

export const getOperations = async () => {
  return await getDocs(apiRefs.operations);
};

export const getOperation = async (id: string) => {
  return await getDoc(apiRefs.operation(id));
};

export const useOperation = (id: string) => {
  const [operationDocData, loading] = useDocumentData<OperationDoc>(
    apiRefs.operation(id)
  );

  return { operationDocData, loading };
};

// unused
export const addOperation = async (params: OperationDoc) => {
  addDoc(apiRefs.operations, params);
};

// unused
export const deleteOperation = async (id: string) => {
  deleteDoc(apiRefs.operation(id));
};

export const useOperations = () => {
  const [operationsDocData, loading] = useCollectionData<OperationDoc>(
    query(apiRefs.operations, orderBy("date", "desc"))
  );

  return { operationsDocData, loading };
};

// TODO: add useUserOperationsCollection - firebase can't sort by time of one user
export const useMyOperations = (userId: string) => {
  const [myOperationsDocData, loading] = useCollectionData<OperationDoc>(
    query(apiRefs.operations, where("userId", "==", userId || ""))
  );

  return { myOperationsDocData, loading };
};
