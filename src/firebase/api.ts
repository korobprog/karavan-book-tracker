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
  const userData = userDocData || {};
  const favorite = userData?.favorite || [];

  const toggleFavorite = async (favoriteId: string) => {
    if (user && userRef) {

      if (favorite.includes(favoriteId)) {
        const filteredFavorite = favorite.filter((value) => value !== favoriteId);
        await setDoc(userRef, { ...userData, favorite: filteredFavorite });
      } else {
        const newFavorite = [...favorite, favoriteId];
        await setDoc(userRef, { ...userData, favorite: newFavorite });
      }
    }
  };

  const setProfile = async (profile: UserDoc) => {
    if (user && userRef) {
      await setDoc(userRef, { ...userData, ...profile });
    }
  };

  const loading = userLoading || userDocLoading;

  return { favorite, toggleFavorite, loading, setProfile };
};
