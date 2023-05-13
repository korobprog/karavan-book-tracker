import { query, orderBy, where, updateDoc } from "firebase/firestore";
import { useCollectionData, useDocumentData } from "react-firebase-hooks/firestore";
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
  teamId?: number;
  yatraLocationId?: string;
  isAuthorized?: boolean;
  isOnline?: boolean;
  isWithoutBookInformation?: boolean;
  isTeamOperation?: boolean;
};

export type OperationDocWithId = OperationDoc & {
  id: string;
};

export const updateOperation = async (id: string, data: Partial<OperationDoc>) => {
  updateDoc(apiRefs.operation(id), data);
};

export const useOperation = (id?: string) => {
  const [operationDocData, loading] = useDocumentData<OperationDoc>(
    id ? apiRefs.operation(id) : null
  );

  return { operationDocData, loading };
};

export const useOperations = () => {
  const [operationsDocData, loading] = useCollectionData<OperationDocWithId>(
    query(apiRefs.operations, orderBy("date", "desc"))
  );

  return { operationsDocData, loading };
};

// TODO: add useUserOperationsCollection - firebase can't sort by time of one user
export const useMyOperations = (userId?: string) => {
  const [myOperationsDocData, loading] = useCollectionData<OperationDocWithId>(
    userId ? query(apiRefs.operations, where("userId", "==", userId || "")) : null
  );

  return { myOperationsDocData, loading };
};
