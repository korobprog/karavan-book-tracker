import { getAuth } from "firebase/auth";
import {
  collection,
  CollectionReference,
  getFirestore,
  addDoc,
  query,
  where,
} from "firebase/firestore";
import { useAuthState } from "react-firebase-hooks/auth";
import { useCollectionData } from "react-firebase-hooks/firestore";

export type DistributedBook = {
  bookId: number;
  count: number;
};

export type OperationDoc = {
  date: string;
  userId: string;
  userName: string;
  locationId: string;
  totalCount: number;
  totalPoints: number;
  books: DistributedBook[];
  isAuthorized?: boolean;
};

export const useOperations = () => {
  const auth = getAuth();
  const db = getFirestore();
  const [user, userLoading] = useAuthState(auth);
  const operationRef = collection(
    db,
    "operations"
  ) as CollectionReference<OperationDoc>;

  const [operationDocData, operationDocLoading] =
    useCollectionData<OperationDoc>(operationRef);

  // TODO: add useUserOperationsCollection - firebase can't sort by time of one user
  const [myOperationDocData, myOperationDocLoading] =
    useCollectionData<OperationDoc>(
      query(operationRef, where("userId", "==", user?.uid || ""))
    );

  const addOperation = async (params: OperationDoc) => {
    addDoc(operationRef, params);
  };

  const loading = operationDocLoading || myOperationDocLoading || userLoading;

  return { operationDocData, addOperation, myOperationDocData, loading };
};
