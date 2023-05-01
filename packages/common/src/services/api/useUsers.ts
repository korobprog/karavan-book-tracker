import { query, where } from "firebase/firestore";
import { useCollectionData } from "react-firebase-hooks/firestore";
import { apiRefs } from "./refs";
import { UserDocWithId } from "./useUser";
import { usePreloadedData } from "../../utils/memo/usePreloadedData";

export type UseUserParams = {
  searchString?: string;
};

export const useUsers = ({ searchString = "" }: UseUserParams) => {
  const [usersDocData, usersDocLoading] = useCollectionData<UserDocWithId>(
    searchString
      ? query(
          apiRefs.users,
          where("name", ">=", searchString),
          where("name", "<=", searchString + "\uf8ff")
        )
      : apiRefs.users
  );

  const preloadedUsers = usePreloadedData(usersDocData, usersDocLoading);

  return {
    usersDocData: preloadedUsers,
    usersDocLoading,
  };
};
