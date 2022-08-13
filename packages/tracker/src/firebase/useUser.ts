import {
  doc,
  DocumentReference,
  getFirestore,
  setDoc,
} from "firebase/firestore";
import { CurrentUser } from "./useCurrentUser";

export type StatisticType = {
  count: number;
  points: number;
};

export type UserDoc = {
  name?: string;
  nameSpiritual?: string;
  phone?: string;
  address?: string;
  city?: string;
  favorite?: string[];
  statistic?: {
    "2022": StatisticType;
  };
};

type Params = {
  currentUser: CurrentUser;
};

export const useUser = ({ currentUser }: Params) => {
  const { user, profile, favorite } = currentUser;
  const db = getFirestore();
  const userRef = (
    user ? doc(db, "users", user?.uid) : null
  ) as DocumentReference<UserDoc> | null;

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
            count: (profile?.statistic?.[2022].count || 0) + newBooks.count,
            points: (profile?.statistic?.[2022].points || 0) + newBooks.points,
          },
        },
      });
    }
  };

  return {
    addStatistic,
    toggleFavorite,
    setProfile,
  };
};
