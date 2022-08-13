import { collection, getFirestore, query, where } from "firebase/firestore";
import { useCollectionData } from "react-firebase-hooks/firestore";
import { UserDoc } from "./useUser";
import { idConverter } from "./utils";

export type UseUserParams = {
  searchString?: string;
};

export const useUsers = ({ searchString = "" }: UseUserParams) => {
  const db = getFirestore();
  const usersRef = collection(db, "users").withConverter(idConverter);
  const [usersDocData, usersDocLoading] = useCollectionData<UserDoc>(
    searchString
      ? query(
        usersRef,
          where("name", ">=", searchString),
          where("name", "<=", searchString + "\uf8ff")
        )
      : usersRef
  );

  return {
    usersDocData,
    usersDocLoading,
  };
};
