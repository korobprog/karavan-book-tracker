import { getAuth } from "firebase/auth";
import {
  doc,
  DocumentReference,
  getFirestore,
  setDoc,
} from "firebase/firestore";
import { useAuthState } from "react-firebase-hooks/auth";
import { useDocumentData } from "react-firebase-hooks/firestore";

type StatisticType = {
  count: number;
  points: number;
};

type UserDoc = {
  name?: string;
  phone?: string;
  address?: string;
  city?: string;
  favorite?: string[];
  statistic?: {
    "2022": StatisticType;
  };
};

export const useUser = () => {
  const auth = getAuth();
  const db = getFirestore();
  const [user, userLoading] = useAuthState(auth);
  const userRef = (
    user ? doc(db, "users", user?.uid) : null
  ) as DocumentReference<UserDoc> | null;

  const [userDocData, userDocLoading] = useDocumentData<UserDoc>(userRef);
  const profile = userDocData || {};
  const favorite = profile?.favorite || [];

  const toggleFavorite = async (favoriteId: string) => {
    if (user && userRef) {
      if (favorite.includes(favoriteId)) {
        const filteredFavorite = favorite.filter(
          (value) => value !== favoriteId
        );
        await setDoc(userRef, { ...profile, favorite: filteredFavorite });
      } else {
        const newFavorite = [...favorite, favoriteId];
        await setDoc(userRef, { ...profile, favorite: newFavorite });
      }
    }
  };

  const setProfile = async (newProfile: UserDoc) => {
    if (user && userRef) {
      await setDoc(userRef, { ...profile, ...newProfile });
    }
  };

  const addStatistic = async (newBooks: StatisticType) => {
    if (user && userRef) {
      await setDoc(userRef, {
        ...profile,
        statistic: {
          "2022": {
            count: (profile.statistic?.[2022].count || 0) + newBooks.count,
            points: (profile.statistic?.[2022].points || 0) + newBooks.points,
          },
        },
      });
    }
  };

  const loading = userLoading || userDocLoading;

  return {
    auth,
    user,
    userLoading,
    favorite,
    addStatistic,
    toggleFavorite,
    loading,
    setProfile,
    profile,
  };
};
