import { getAuth } from "firebase/auth";
import {
  doc,
  DocumentReference,
  getFirestore,
  setDoc,
} from "firebase/firestore";
import { useAuthState } from "react-firebase-hooks/auth";
import { useDocumentData } from "react-firebase-hooks/firestore";

type UserDoc = {
  name?: string;
  phone?: string;
  address?: string;
  city?: string;
  favorite?: string[];
};

export const useUser = () => {
  const auth = getAuth();
  const db = getFirestore();
  const [user, userLoading] = useAuthState(auth);
  const userRef = (
    user ? doc(db, "users", user?.uid) : null
  ) as DocumentReference<UserDoc> | null;

  const [userDocData, userDocLoading] = useDocumentData<UserDoc>(userRef);

  const toggleFavorite = async (favoriteId: string) => {
    if (user && userRef) {
      const favoriteArr = userDocData?.favorite || [];
      if (favoriteArr.includes(favoriteId)) {
        const favorite = favoriteArr.filter((value) => value !== favoriteId);
        await setDoc(userRef, { ...userDocData, favorite });
      } else {
        const favorite = [...favoriteArr, favoriteId];
        await setDoc(userRef, { ...userDocData, favorite });
      }
    }
  };

  const setProfile = async (profile: UserDoc) => {
    if (user && userRef) {
      await setDoc(userRef, { ...userDocData, ...profile });
    }
  };

  const favorite = userDocData?.favorite || ([] as string[]);
  const loading = userLoading || userDocLoading;

  return { favorite, toggleFavorite, loading, setProfile };
};
