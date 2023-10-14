import { useEffect, useState } from "react";
import { getAuth } from "firebase/auth";
import { useAuthState } from "react-firebase-hooks/auth";
import { useDocumentData } from "react-firebase-hooks/firestore";
import { UserDoc } from "./useUser";
import { apiRefs } from "./refs";

export const useCurrentUser = () => {
  const auth = getAuth();
  const [user, userLoading] = useAuthState(auth);
  const [userPreloaded, setUserPreloaded] = useState(false);

  const userRef = user ? apiRefs.user(user.uid) : null;

  const [userDocData, userDocLoading] = useDocumentData<UserDoc>(userRef);

  useEffect(() => {
    if (!userLoading && !userPreloaded) {
      setUserPreloaded(true);
    }
  }, [user, userLoading, userPreloaded]);

  const profile = user && userDocData ? { ...userDocData, id: user?.uid } : null;

  const favorite = profile?.favorite || [];

  const loading = userLoading || !userPreloaded;

  return {
    auth,
    user,
    favorite,
    profile,
    loading,
    userDocLoading,
  };
};

export type CurrentUser = ReturnType<typeof useCurrentUser>;
